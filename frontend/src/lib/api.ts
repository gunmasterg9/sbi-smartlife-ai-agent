const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: any) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Customers
  getCustomers: (params?: string) => fetchAPI(`/customers/${params ? `?${params}` : ''}`),
  getCustomer: (id: string) => fetchAPI(`/customers/${id}`),
  getSegments: () => fetchAPI('/customers/segments'),

  // Digital Twin
  getDigitalTwin: (customerId: string) => fetchAPI(`/digital-twin/${customerId}`),
  getTwinPredictions: (customerId: string) => fetchAPI(`/digital-twin/${customerId}/predictions`),
  listDigitalTwins: () => fetchAPI('/digital-twin/'),

  // Transactions
  getTransactions: (customerId: string, params?: string) =>
    fetchAPI(`/transactions/${customerId}${params ? `?${params}` : ''}`),
  getSpendingAnalytics: (customerId: string) =>
    fetchAPI(`/transactions/${customerId}/analytics`),

  // Recommendations
  getRecommendations: (customerId: string) => fetchAPI(`/recommendations/${customerId}`),
  acceptRecommendation: (id: string) =>
    fetchAPI(`/recommendations/${id}/accept`, { method: 'POST' }),
  rejectRecommendation: (id: string) =>
    fetchAPI(`/recommendations/${id}/reject`, { method: 'POST' }),

  // Analytics
  getKPIs: () => fetchAPI('/analytics/kpis'),
  getAcquisitionFunnel: () => fetchAPI('/analytics/acquisition-funnel'),
  getEngagementDistribution: () => fetchAPI('/analytics/engagement-distribution'),
  getAgentPerformance: () => fetchAPI('/analytics/agent-performance'),

  // Wellness
  getWellnessScore: (customerId: string) => fetchAPI(`/wellness/${customerId}`),
  getGoals: (customerId: string) => fetchAPI(`/wellness/${customerId}/goals`),
  getDebtAnalysis: (customerId: string) => fetchAPI(`/wellness/${customerId}/debts`),

  // Life Events
  getLifeEvents: (customerId: string) => fetchAPI(`/life-events/${customerId}`),
  getLifeEventStats: () => fetchAPI('/life-events/stats/overview'),

  // Engagement
  getEngagement: (customerId: string) => fetchAPI(`/engagement/${customerId}`),
  getEngagementOverview: () => fetchAPI('/engagement/stats/overview'),

  // Compliance
  getAuditTrail: () => fetchAPI('/compliance/audit-trail'),
  getKYCStatus: () => fetchAPI('/compliance/kyc-status'),
  getComplianceChecklist: () => fetchAPI('/compliance/compliance-checklist'),

  // Agents
  getAgentStatus: () => fetchAPI('/agents/status'),
  getAgentActions: (agentType?: string) =>
    fetchAPI(`/agents/actions${agentType ? `?agent_type=${agentType}` : ''}`),

  // Chat
  sendMessage: (message: string, customerId?: string, language?: string) =>
    fetchAPI('/chat/', {
      method: 'POST',
      body: JSON.stringify({ message, customer_id: customerId, language }),
    }),
};
