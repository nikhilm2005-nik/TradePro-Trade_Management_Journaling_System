const API_URL = 'http://localhost:5000/api';

// Helper to get the token from local storage
const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const tradeApi = {
  // --- AUTH ROUTES ---
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(credentials) 
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  register: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/register`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(credentials) 
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // --- TRADE ROUTES ---
  getStats: async (startDate = '', endDate = '') => {
    // Passes the dates if they exist!
    const url = `${API_URL}/trades/stats?startDate=${startDate}&endDate=${endDate}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
  
  getPaginated: async (page = 1, search = '', startDate = '', endDate = '') => {
    // Passes the search and dates if they exist!
    const url = `${API_URL}/trades?page=${page}&limit=10&search=${search}&startDate=${startDate}&endDate=${endDate}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch trades');
    return res.json();
  },
  
  create: async (data) => {
    const res = await fetch(`${API_URL}/trades`, { 
      method: 'POST', 
      headers: authHeaders(), 
      body: JSON.stringify(data) 
    });
    if (!res.ok) throw new Error('Failed to create trade');
    return res.json();
  },
  
  close: async (id, exitPrice) => {
    const res = await fetch(`${API_URL}/trades/${id}`, { 
      method: 'PUT', 
      headers: authHeaders(), 
      body: JSON.stringify({ exitPrice }) 
    });
    if (!res.ok) throw new Error('Failed to close trade');
    return res.json();
  },
  
  remove: async (id) => {
    const res = await fetch(`${API_URL}/trades/${id}`, { 
      method: 'DELETE', 
      headers: authHeaders() 
    });
    if (!res.ok) throw new Error('Failed to delete trade');
    return res.json();
  }
};