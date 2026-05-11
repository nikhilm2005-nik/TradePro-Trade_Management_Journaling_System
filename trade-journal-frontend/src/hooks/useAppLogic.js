import { useState, useEffect } from 'react';
import { tradeApi } from '../api/trades';

export const useAppLogic = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('ALL');
  
  const [formData, setFormData] = useState({
    ticker: '', direction: 'LONG', entryPrice: '', size: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState(null);
  const [exitPrice, setExitPrice] = useState('');

  const getDateRange = () => {
    if (timeframe === 'ALL') return { start: '', end: '' };
    const end = new Date(); const start = new Date();
    if (timeframe === 'WEEK') start.setDate(end.getDate() - 7);
    if (timeframe === 'MONTH') start.setMonth(end.getMonth() - 1);
    if (timeframe === 'YEAR') start.setFullYear(end.getFullYear() - 1);
    return { start: start.toISOString(), end: end.toISOString() };
  };

  const fetchStats = async () => {
    try { const { start, end } = getDateRange(); setStats(await tradeApi.getStats(start, end)); } catch (err) {}
  };

  const fetchTrades = async () => {
    try {
      setIsLoading(true); const { start, end } = getDateRange();
      const data = await tradeApi.getPaginated(currentPage, searchQuery, start, end);
      setTrades(data.trades); setTotalPages(data.totalPages); setError(null);
    } catch (err) { setError('Failed to load trades. Is your token valid?'); } finally { setIsLoading(false); }
  };

  useEffect(() => { if (token) fetchStats(); }, [token, timeframe]);
  useEffect(() => {
    if (token) { const delay = setTimeout(() => { fetchTrades(); }, 300); return () => clearTimeout(delay); }
  }, [searchQuery, currentPage, token, timeframe]);

  const handleLogout = () => { localStorage.removeItem('token'); setToken(null); setTrades([]); setStats([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await tradeApi.create({ ...formData, entryDate: new Date().toISOString(), entryPrice: parseFloat(formData.entryPrice), size: parseFloat(formData.size) });
      setFormData({ ticker: '', direction: 'LONG', entryPrice: '', size: '' });
      await fetchStats(); await fetchTrades(); 
    } catch (err) { setError(err.message || 'Failed to log trade.'); setIsLoading(false); }
  };

  const openCloseModal = (id) => { setSelectedTradeId(id); setExitPrice(''); setIsModalOpen(true); };
  const handleCloseTrade = async () => {
    if (!exitPrice) return;
    try {
      setIsLoading(true); setIsModalOpen(false);
      await tradeApi.close(selectedTradeId, parseFloat(exitPrice)); await fetchStats(); await fetchTrades();
    } catch (err) { setError('Failed to close trade.'); setIsLoading(false); }
  };

  const handleDeleteTrade = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try { setIsLoading(true); await tradeApi.remove(id); await fetchStats(); await fetchTrades(); } catch (err) {}
  };

  const totalTrades = stats.length;
  const totalPnL = stats.reduce((acc, t) => acc + (parseFloat(t.netPnL) || 0), 0);
  const winRate = totalTrades > 0 ? ((stats.filter(t => parseFloat(t.netPnL) > 0).length / totalTrades) * 100).toFixed(1) : 0;
  let runningPnL = 0;
  const chartData = [...stats].map(t => { runningPnL += (parseFloat(t.netPnL) || 0); return { date: new Date(t.entryDate).toLocaleDateString(), pnl: runningPnL }; });

  return {
    token, setToken, trades, isLoading, error, currentPage, setCurrentPage, totalPages, searchQuery, setSearchQuery, timeframe, setTimeframe, 
    formData, setFormData, isModalOpen, setIsModalOpen, exitPrice, setExitPrice,
    handleLogout, handleSubmit, openCloseModal, handleCloseTrade, handleDeleteTrade, totalTrades, totalPnL, winRate, chartData
  };
};