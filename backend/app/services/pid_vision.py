import fitz  # PyMuPDF
import base64
import json
from groq import AsyncGroq
from app.config import get_settings

class PIDVisionParser:
    """
    Extracts P&ID symbols from scanned PDF pages using 
    PyMuPDF (page→image) + Groq vision LLM.
    """
    def __init__(self):
        self.settings = get_settings()
        self.groq_client = AsyncGroq(api_key=self.settings.groq_api_key)

    def pdf_page_to_base64(self, pdf_path: str, page_num: int = 0) -> str:
        doc = fitz.open(pdf_path)
        page = doc[page_num]
        mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for clarity
        pix = page.get_pixmap(matrix=mat)
        img_bytes = pix.tobytes("png")
        return base64.b64encode(img_bytes).decode("utf-8")

    async def parse_pid_image(self, pdf_path: str) -> dict:
        """Convert P&ID PDF page to image, send to LLM vision for symbol extraction."""
        try:
            img_b64 = self.pdf_page_to_base64(pdf_path)
        except Exception as e:
            return {"error": str(e), "equipment": [], "instruments": [], "connections": []}

        prompt = """You are an expert P&ID (Piping and Instrumentation Diagram) analyst.
        
Analyse this industrial P&ID drawing and extract ALL visible elements.
Return ONLY valid JSON:
{
  "equipment": [{"tag": "P-101A", "type": "Centrifugal Pump", "description": "..."}],
  "instruments": [{"tag": "FIC-101", "type": "Flow Controller", "description": "..."}],
  "connections": [{"from": "P-101A", "to": "E-101", "type": "Process Line", "spec": "6in CS"}],
  "process_description": "Brief description of the process shown."
}"""

        response = await self.groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",  # Groq vision model
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}},
                    {"type": "text", "text": prompt}
                ]
            }],
            response_format={"type": "json_object"},
            max_tokens=2000,
            temperature=0.1,
        )
        
        return json.loads(response.choices[0].message.content)

pid_vision_parser = PIDVisionParser()
