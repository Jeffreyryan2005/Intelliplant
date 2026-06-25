"""
Knowledge graph service for IntelliPlant.

Builds and maintains a NetworkX-based knowledge graph from extracted
document entities.  Supports serialisation to JSON (D3.js format),
pickle persistence, search, and node-level queries.
"""

from __future__ import annotations

import json
import logging
import pickle
from pathlib import Path
from typing import Any, Optional

import networkx as nx

from app.config import GRAPH_DIR
from app.models.schemas import (
    EntityType,
    ExtractedEntity,
    GraphData,
    GraphLink,
    GraphNode,
    NodeDetail,
)

logger = logging.getLogger("intelliplant.knowledge_graph")

GRAPH_PICKLE = GRAPH_DIR / "knowledge_graph.gpickle"


class KnowledgeGraphService:
    """
    Manages the industrial knowledge graph.

    Nodes represent entities (Equipment, Regulation, Chemical, …) and
    documents.  Edges encode relationships discovered during document
    processing such as "MENTIONED_IN", "MAINTAINED_BY", "REFERENCES",
    "USES_CHEMICAL", "FAILURE_OF", etc.
    """

    def __init__(self):
        self.graph: nx.Graph = nx.Graph()
        self._load()

    # ── Persistence ────────────────────────────────────────────────────

    def _load(self) -> None:
        """Load the graph from disk if a pickle file exists."""
        if GRAPH_PICKLE.exists():
            try:
                with open(GRAPH_PICKLE, "rb") as f:
                    self.graph = pickle.load(f)
                logger.info(
                    "Loaded knowledge graph: %d nodes, %d edges",
                    self.graph.number_of_nodes(),
                    self.graph.number_of_edges(),
                )
            except Exception as exc:
                logger.warning("Failed to load graph pickle — starting fresh: %s", exc)
                self.graph = nx.Graph()
        else:
            logger.info("No existing graph found — starting with empty graph")

    def save(self) -> None:
        """Persist the current graph to disk as a pickle file."""
        GRAPH_DIR.mkdir(parents=True, exist_ok=True)
        with open(GRAPH_PICKLE, "wb") as f:
            pickle.dump(self.graph, f, protocol=pickle.HIGHEST_PROTOCOL)
        logger.info(
            "Saved knowledge graph: %d nodes, %d edges",
            self.graph.number_of_nodes(),
            self.graph.number_of_edges(),
        )

    # ── Graph construction ─────────────────────────────────────────────

    def _node_id(self, label: str, node_type: str) -> str:
        """Deterministic node identifier from label + type."""
        clean = label.strip().replace(" ", "_").replace("/", "_")
        return f"{node_type}:{clean}"

    def add_document(
        self,
        doc_id: str,
        filename: str,
        entities: list[ExtractedEntity],
        sections: list[str] | None = None,
    ) -> None:
        """
        Add a processed document and its entities to the knowledge graph.

        Creates a Document node, entity nodes for each extracted entity,
        and MENTIONED_IN edges between them.  Also infers inter-entity
        relationships (e.g. equipment ↔ failure mode, equipment ↔ regulation).
        """
        # 1. Document node
        doc_node_id = f"DOC:{doc_id}"
        self.graph.add_node(
            doc_node_id,
            label=filename,
            type="Document",
            properties={
                "doc_id": doc_id,
                "filename": filename,
                "sections": sections or [],
            },
        )

        # 2. Entity nodes + MENTIONED_IN edges
        entity_nodes_by_type: dict[str, list[str]] = {}
        for entity in entities:
            etype = entity.type.value
            node_id = self._node_id(entity.text, etype)

            if not self.graph.has_node(node_id):
                self.graph.add_node(
                    node_id,
                    label=entity.text,
                    type=etype,
                    properties={
                        "confidence": entity.confidence,
                        "mentioned_in": [doc_id],
                    },
                )
            else:
                # Update mention list
                props = self.graph.nodes[node_id].get("properties", {})
                mentions = props.get("mentioned_in", [])
                if doc_id not in mentions:
                    mentions.append(doc_id)
                    props["mentioned_in"] = mentions
                    self.graph.nodes[node_id]["properties"] = props

            # MENTIONED_IN edge
            if not self.graph.has_edge(node_id, doc_node_id):
                self.graph.add_edge(
                    node_id, doc_node_id,
                    type="MENTIONED_IN",
                    label="mentioned in",
                )

            entity_nodes_by_type.setdefault(etype, []).append(node_id)

        # 3. Infer inter-entity relationships
        self._infer_relationships(entity_nodes_by_type, doc_node_id)

        logger.info(
            "Added document '%s' to graph — now %d nodes, %d edges",
            filename, self.graph.number_of_nodes(), self.graph.number_of_edges(),
        )

    def _infer_relationships(
        self,
        by_type: dict[str, list[str]],
        doc_node_id: str,
    ) -> None:
        """
        Infer typed edges between co-occurring entities within a document.

        Heuristic rules:
        - Equipment ↔ FailureMode    → FAILURE_OF
        - Equipment ↔ Chemical       → PROCESSES
        - Equipment ↔ Regulation     → GOVERNED_BY
        - Equipment ↔ Person         → MAINTAINED_BY
        - Equipment ↔ Location       → LOCATED_AT
        - Regulation ↔ Document(doc) → REFERENCED_BY
        """
        equip_nodes = by_type.get("Equipment", [])
        failure_nodes = by_type.get("FailureMode", [])
        chem_nodes = by_type.get("Chemical", [])
        reg_nodes = by_type.get("Regulation", [])
        person_nodes = by_type.get("Person", [])
        loc_nodes = by_type.get("Location", [])

        def _link(a: str, b: str, rel_type: str, label: str):
            if not self.graph.has_edge(a, b):
                self.graph.add_edge(a, b, type=rel_type, label=label)

        for eq in equip_nodes:
            for fm in failure_nodes:
                _link(eq, fm, "FAILURE_OF", "has failure")
            for ch in chem_nodes:
                _link(eq, ch, "PROCESSES", "processes")
            for reg in reg_nodes:
                _link(eq, reg, "GOVERNED_BY", "governed by")
            for per in person_nodes:
                _link(eq, per, "MAINTAINED_BY", "maintained by")
            for loc in loc_nodes:
                _link(eq, loc, "LOCATED_AT", "located at")

        for reg in reg_nodes:
            _link(reg, doc_node_id, "REFERENCED_BY", "referenced by")

    def add_pid_entities(self, doc_id: str, entities: list[dict], connections: list[dict]) -> None:
        """Add P&ID specific entities and connections to the graph."""
        doc_node_id = f"DOC:{doc_id}"
        
        # Add equipment/instrument nodes
        for e in entities:
            node_id = self._node_id(e["tag"], e["type"])
            if not self.graph.has_node(node_id):
                self.graph.add_node(
                    node_id,
                    label=e["tag"],
                    type=e.get("type", "Equipment"),
                    properties={"mentioned_in": [doc_id]}
                )
            
            # Link to document
            if not self.graph.has_edge(node_id, doc_node_id):
                self.graph.add_edge(node_id, doc_node_id, type="MENTIONED_IN", label="mentioned in")
                
        # Add process connections
        for conn in connections:
            from_node = self._node_id(conn.get("from", ""), "Equipment")  # simplified type inference
            to_node = self._node_id(conn.get("to", ""), "Equipment")
            
            # Only add edge if both nodes exist (to avoid creating orphaned nodes)
            if self.graph.has_node(from_node) and self.graph.has_node(to_node):
                if not self.graph.has_edge(from_node, to_node):
                    self.graph.add_edge(from_node, to_node, type="PROCESS_CONNECTION", label=conn.get("type", "connected to"), properties={"spec": conn.get("spec", "")})
        
        self.save()
        logger.info("Added P&ID entities from document %s", doc_id)

    def remove_document(self, doc_id: str) -> None:
        """
        Remove a document and its orphaned entities from the graph.

        Entity nodes that are only mentioned in the deleted document are
        also removed.  Shared entity nodes keep their other mentions.
        """
        doc_node_id = f"DOC:{doc_id}"
        if not self.graph.has_node(doc_node_id):
            return

        # Find all entity nodes connected only to this document
        neighbours = list(self.graph.neighbors(doc_node_id))
        self.graph.remove_node(doc_node_id)

        for neighbour in neighbours:
            if self.graph.has_node(neighbour):
                # Remove doc_id from mentioned_in list
                props = self.graph.nodes[neighbour].get("properties", {})
                mentions = props.get("mentioned_in", [])
                if doc_id in mentions:
                    mentions.remove(doc_id)
                    props["mentioned_in"] = mentions

                # If the node has no remaining connections, remove it
                if self.graph.degree(neighbour) == 0:
                    self.graph.remove_node(neighbour)

        self.save()
        logger.info("Removed document %s from graph", doc_id)

    # ── Query methods ──────────────────────────────────────────────────

    def to_d3_json(self) -> GraphData:
        """
        Serialize the full graph to D3.js-compatible format.

        Returns:
            GraphData with nodes and links arrays.
        """
        nodes = []
        for node_id, attrs in self.graph.nodes(data=True):
            nodes.append(GraphNode(
                id=node_id,
                label=attrs.get("label", node_id),
                type=attrs.get("type", "Unknown"),
                properties=attrs.get("properties", {}),
            ))

        links = []
        for u, v, attrs in self.graph.edges(data=True):
            links.append(GraphLink(
                source=u,
                target=v,
                type=attrs.get("type", "RELATED"),
                label=attrs.get("label", ""),
            ))

        return GraphData(nodes=nodes, links=links)

    def search_nodes(self, query: str, limit: int = 20) -> list[GraphNode]:
        """
        Search for nodes whose label contains the query string.

        Args:
            query: Case-insensitive search term.
            limit: Maximum number of results.

        Returns:
            List of matching GraphNode objects.
        """
        query_lower = query.lower()
        results = []
        for node_id, attrs in self.graph.nodes(data=True):
            label = attrs.get("label", "")
            if query_lower in label.lower() or query_lower in node_id.lower():
                results.append(GraphNode(
                    id=node_id,
                    label=label,
                    type=attrs.get("type", "Unknown"),
                    properties=attrs.get("properties", {}),
                ))
                if len(results) >= limit:
                    break
        return results

    def get_node_detail(self, node_id: str) -> Optional[NodeDetail]:
        """
        Get a node and all its immediate neighbours.

        Args:
            node_id: The graph node identifier.

        Returns:
            NodeDetail or None if node not found.
        """
        if not self.graph.has_node(node_id):
            return None

        attrs = self.graph.nodes[node_id]
        node = GraphNode(
            id=node_id,
            label=attrs.get("label", node_id),
            type=attrs.get("type", "Unknown"),
            properties=attrs.get("properties", {}),
        )

        connected_nodes = []
        connected_links = []

        for neighbour in self.graph.neighbors(node_id):
            n_attrs = self.graph.nodes[neighbour]
            connected_nodes.append(GraphNode(
                id=neighbour,
                label=n_attrs.get("label", neighbour),
                type=n_attrs.get("type", "Unknown"),
                properties=n_attrs.get("properties", {}),
            ))

            edge_attrs = self.graph.edges[node_id, neighbour]
            connected_links.append(GraphLink(
                source=node_id,
                target=neighbour,
                type=edge_attrs.get("type", "RELATED"),
                label=edge_attrs.get("label", ""),
            ))

        return NodeDetail(
            node=node,
            connected_nodes=connected_nodes,
            connected_links=connected_links,
        )

    def get_stats(self) -> dict[str, int]:
        """Return basic graph statistics."""
        type_counts: dict[str, int] = {}
        for _, attrs in self.graph.nodes(data=True):
            t = attrs.get("type", "Unknown")
            type_counts[t] = type_counts.get(t, 0) + 1

        return {
            "total_nodes": self.graph.number_of_nodes(),
            "total_edges": self.graph.number_of_edges(),
            "node_types": type_counts,
        }

    def get_equipment_nodes(self) -> list[GraphNode]:
        """Return all nodes of type Equipment."""
        results = []
        for node_id, attrs in self.graph.nodes(data=True):
            if attrs.get("type") == "Equipment":
                results.append(GraphNode(
                    id=node_id,
                    label=attrs.get("label", node_id),
                    type="Equipment",
                    properties=attrs.get("properties", {}),
                ))
        return results

# Singleton instance
knowledge_graph = KnowledgeGraphService()
