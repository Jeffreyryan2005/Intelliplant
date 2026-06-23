import os
import uuid
import json
import pickle
from typing import List, Dict, Any, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from groq import AsyncGroq

from app.config import get_settings, CHROMA_DIR
from app.models.schemas import Citation

class RAGPipeline:
    """
    Retrieval-Augmented Generation (RAG) Pipeline using Scikit-Learn (TF-IDF) and Groq.
    Handles embedding documents, vector similarity search, and LLM inference without heavy vector DB dependencies.
    """
    def __init__(self):
        self.settings = get_settings()
        self.groq_client = AsyncGroq(api_key=self.settings.groq_api_key)
        
        self.db_path = CHROMA_DIR / "vector_store.pkl"
        self.documents = []
        self.metadatas = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = None
        self._load_db()

    def _load_db(self):
        if self.db_path.exists():
            with open(self.db_path, "rb") as f:
                data = pickle.load(f)
                self.documents = data["documents"]
                self.metadatas = data["metadatas"]
                if self.documents:
                    self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)

    def _save_db(self):
        CHROMA_DIR.mkdir(parents=True, exist_ok=True)
        with open(self.db_path, "wb") as f:
            pickle.dump({
                "documents": self.documents,
                "metadatas": self.metadatas
            }, f)
        if self.documents:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)

    def add_documents(self, doc_id: str, filename: str, chunks: List[str], metadata_list: List[Dict[str, Any]]):
        """
        Embed and store document chunks.
        """
        if not chunks:
            return

        for chunk, meta in zip(chunks, metadata_list):
            meta["doc_id"] = doc_id
            meta["filename"] = filename
            self.documents.append(chunk)
            self.metadatas.append(meta)
            
        self._save_db()

    def delete_document(self, doc_id: str):
        """
        Remove all chunks for a specific document.
        """
        indices_to_keep = [i for i, meta in enumerate(self.metadatas) if meta.get("doc_id") != doc_id]
        self.documents = [self.documents[i] for i in indices_to_keep]
        self.metadatas = [self.metadatas[i] for i in indices_to_keep]
        self._save_db()

    def search(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """
        Perform vector similarity search using TF-IDF and Cosine Similarity.
        """
        if not self.documents or self.tfidf_matrix is None:
            return []
            
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix)[0]
        
        top_indices = similarities.argsort()[-n_results:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.05: # threshold
                results.append({
                    "text": self.documents[idx],
                    "metadata": self.metadatas[idx],
                    "score": float(similarities[idx])
                })
        return results

    async def generate_chat_response(self, query: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Generate a non-streaming chat response using RAG.
        """
        history = history or []
        
        # 1. Retrieve relevant context
        search_results = self.search(query, n_results=4)
        
        # 2. Format context and citations
        context_parts = []
        citations = []
        
        for idx, res in enumerate(search_results):
            meta = res["metadata"]
            text = res["text"]
            filename = meta.get("filename", "Unknown Document")
            section = meta.get("section", "")
            
            context_parts.append(f"--- Document: {filename} (Section: {section}) ---\n{text}\n")
            
            citations.append(Citation(
                document=filename,
                section=section,
                relevance_score=res["score"],
                text_snippet=text[:100] + "..."
            ))
            
        context_str = "\n".join(context_parts)
        
        # 3. Construct prompt
        system_prompt = (
            "You are IntelliPlant Copilot, an AI assistant for industrial knowledge intelligence. "
            "You help engineers and operators troubleshoot issues, understand procedures, and verify compliance. "
            "Use the provided context to answer the user's query. If the context does not contain the answer, "
            "say 'I cannot find the answer in the provided documents' but you may provide general engineering knowledge. "
            "Always be precise, safe, and professional."
        )
        
        user_prompt = f"Context Information:\n{context_str}\n\nUser Query: {query}"
        
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append(msg)
        messages.append({"role": "user", "content": user_prompt})
        
        # 4. Call Groq
        response = await self.groq_client.chat.completions.create(
            model=self.settings.llm_chat_model,
            messages=messages,
            temperature=self.settings.llm_temperature,
            max_tokens=self.settings.llm_max_tokens,
        )
        
        answer = response.choices[0].message.content
        
        # 5. Generate suggested follow-ups
        followup_prompt = f"Based on the query '{query}' and this answer, suggest 3 concise follow-up questions the user might ask. Return ONLY the questions, one per line."
        try:
            followup_response = await self.groq_client.chat.completions.create(
                model=self.settings.llm_fast_model,
                messages=[{"role": "user", "content": followup_prompt}],
                temperature=0.5,
                max_tokens=150,
            )
            followups = [q.strip("- ").strip() for q in followup_response.choices[0].message.content.split("\n") if q.strip()]
        except Exception:
            followups = []
            
        return {
            "answer": answer,
            "citations": citations,
            "suggested_followups": followups[:3]
        }

    async def stream_chat_response(self, query: str, history: List[Dict[str, str]] = None):
        """
        Stream a chat response using RAG. Yields SSE events.
        """
        history = history or []
        
        # 1. Retrieve
        search_results = self.search(query, n_results=4)
        
        # Yield citations first
        citations = []
        context_parts = []
        for res in search_results:
            meta = res["metadata"]
            text = res["text"]
            filename = meta.get("filename", "Unknown Document")
            section = meta.get("section", "")
            
            context_parts.append(f"--- Document: {filename} (Section: {section}) ---\n{text}\n")
            citations.append({
                "document": filename,
                "section": section,
                "relevance_score": res["score"],
                "text_snippet": text[:100] + "..."
            })
            
        yield f"data: {json.dumps({'type': 'citations', 'citations': citations})}\n\n"
        
        context_str = "\n".join(context_parts)
        
        system_prompt = (
            "You are IntelliPlant Copilot, an AI assistant for industrial knowledge intelligence. "
            "Use the provided context to answer the user's query accurately. "
            "Cite the documents where appropriate."
        )
        
        user_prompt = f"Context Information:\n{context_str}\n\nUser Query: {query}"
        
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append(msg)
        messages.append({"role": "user", "content": user_prompt})
        
        stream = await self.groq_client.chat.completions.create(
            model=self.settings.llm_chat_model,
            messages=messages,
            temperature=self.settings.llm_temperature,
            max_tokens=self.settings.llm_max_tokens,
            stream=True
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                yield f"data: {json.dumps({'type': 'chunk', 'content': content})}\n\n"
                
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

# Singleton instance
rag_pipeline = RAGPipeline()
