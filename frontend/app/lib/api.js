// ============================================================
// IntelliPlant — API Client with Demo Fallback
// ============================================================
import * as DemoData from './demoData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://intelliplant-f25r.onrender.com';

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error.message);
    return null; // Caller should fall back to demo data
  }
}

export async function uploadDocument(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Upload failed:', error.message);
    // Return a fake success for demo
    return {
      success: true,
      document: {
        id: `doc-${Date.now()}`,
        title: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'document',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'processing',
        entityCount: 0,
      },
    };
  }
}

export async function chatWithCopilot(query, conversationId = null) {
  try {
    const response = await fetch(`${API_URL}/api/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, conversation_id: conversationId }),
    });
    if (!response.ok) throw new Error(`Chat failed: ${response.status}`);
    return response; // Return response for streaming
  } catch (error) {
    console.warn('Chat API failed:', error.message);
    return null;
  }
}

export async function getDocuments() {
  const data = await fetchAPI('/api/documents');
  return data || DemoData.documents;
}

export async function getDocumentById(id) {
  const data = await fetchAPI(`/api/documents/${id}`);
  return data || DemoData.documents.find(d => d.id === id);
}

export async function getGraphData() {
  const data = await fetchAPI('/api/graph');
  return data || { nodes: DemoData.graphNodes, links: DemoData.graphEdges };
}

export async function getDashboard() {
  const data = await fetchAPI('/api/dashboard');
  return data || {
    metrics: DemoData.dashboardMetrics,
    activity: DemoData.recentActivity,
    health: DemoData.systemHealth
  };
}

export async function getMaintenanceDashboard() {
  const data = await fetchAPI('/api/maintenance');
  return data || DemoData.equipmentList;
}

export async function getEquipmentById(id) {
  const data = await fetchAPI(`/api/maintenance/equipment/${id}`);
  return data || DemoData.equipmentList.find(e => e.id === id);
}

export async function getComplianceOverview() {
  const data = await fetchAPI('/api/compliance');
  return data || DemoData.complianceData;
}

export async function searchKnowledge(query) {
  const data = await fetchAPI(`/api/search?q=${encodeURIComponent(query)}`);
  return data || { results: [] };
}
