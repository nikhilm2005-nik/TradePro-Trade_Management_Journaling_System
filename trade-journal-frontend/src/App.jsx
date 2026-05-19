import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Loader2, Trash2, Search, ChevronLeft, ChevronRight, LogOut, Calendar } from 'lucide-react';
import { Modal } from './components/Modal';
import { AuthScreen } from './components/AuthScreen';
import { useAppLogic } from './hooks/useAppLogic';

function App() {
  const logic = useAppLogic();

  if (!logic.token) return <AuthScreen onLogin={logic.setToken} />;

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 font-sans relative overflow-x-hidden pb-12 selection:bg-blue-200">
      
      {/* --- THE FIX: DEPTH-STACKED BACKGROUND --- */}
      {/* 1. The Base Image Layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/chart-bg.png')",
          filter: "blur(1.5px) brightness(0.9)" 
        }}
      ></div>
      
      {/* 2. The Dynamic Tint Layer (Gives it that "Pro" feel) */}
      <div className="fixed inset-0 z-10 bg-gradient-to-br from-slate-100/40 via-transparent to-blue-100/30 backdrop-blur-[2px]"></div>

      {/* ----------------------------------------- */}

      <Modal isOpen={logic.isModalOpen} onClose={() => logic.setIsModalOpen(false)} title="Close Trade">
        <div className="space-y-4">
          <Input label="Exit Price" type="number" step="any" value={logic.exitPrice} onChange={logic.setExitPrice} placeholder="Enter final price..." />
          <button onClick={logic.handleCloseTrade} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg">Confirm Close</button>
        </div>
      </Modal>

      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8 relative z-20 pt-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="bg-white/40 backdrop-blur-md border border-white/60 p-2 px-6 rounded-2xl shadow-xl flex items-center gap-3">
            <Activity className="text-blue-600" size={28} />
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">TradePro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg px-4 py-2 flex items-center">
              <Calendar size={16} className="text-blue-600 mr-2" />
              <select value={logic.timeframe} onChange={(e) => logic.setTimeframe(e.target.value)} className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer">
                <option value="ALL">All Time</option>
                <option value="YEAR">Past Year</option>
                <option value="MONTH">Past 30 Days</option>
                <option value="WEEK">Past 7 Days</option>
              </select>
            </div>
            <button onClick={logic.handleLogout} className="group bg-white/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/60 shadow-lg hover:bg-red-50 transition-all">
              <LogOut size={18} className="text-slate-600 group-hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Trades" value={logic.totalTrades} color="text-slate-900" />
          <StatCard label="Total PnL" value={`$${logic.totalPnL.toFixed(2)}`} color={logic.totalPnL >= 0 ? "text-emerald-600" : "text-red-600"} />
          <StatCard label="Win Rate" value={`${logic.winRate}%`} color="text-blue-700" />
          <StatCard label="Avg Trade" value={`$${logic.totalTrades > 0 ? (logic.totalPnL / logic.totalTrades).toFixed(2) : 0}`} color="text-amber-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/60 shadow-2xl p-8 rounded-[2.5rem] ring-1 ring-white/50">
            <h2 className="text-xl font-bold mb-8 text-slate-900 flex items-center gap-2 uppercase tracking-widest text-xs">
               Journal Entry
            </h2>
            <form onSubmit={logic.handleSubmit} className="space-y-6">
              <Input label="Ticker" value={logic.formData.ticker} onChange={v => logic.setFormData({...logic.formData, ticker: v.toUpperCase()})} placeholder="e.g. EURUSD" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Direction</label>
                  <select className="w-full bg-white/50 border border-white rounded-2xl p-3 text-sm font-bold outline-none focus:ring-4 ring-blue-500/20" value={logic.formData.direction} onChange={e => logic.setFormData({...logic.formData, direction: e.target.value})}><option value="LONG">Long</option><option value="SHORT">Short</option></select>
                </div>
                <Input label="Entry Price" type="number" step="any" value={logic.formData.entryPrice} onChange={v => logic.setFormData({...logic.formData, entryPrice: v})} placeholder="0.0000" />
              </div>
              <Input label="Position Size" type="number" step="any" value={logic.formData.size} onChange={v => logic.setFormData({...logic.formData, size: v})} placeholder="1.0" />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all">Log Trade</button>
            </form>
          </div>

          {/* CHART */}
          <div className="lg:col-span-2 bg-white/30 backdrop-blur-xl border border-white/60 shadow-2xl p-8 rounded-[2.5rem] ring-1 ring-white/50 min-h-[400px]">
             <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Growth Curve</h2>
             <ResponsiveContainer width="100%" height={300}>
                <LineChart data={logic.chartData}>
                  <CartesianGrid strokeDasharray="10 10" stroke="rgba(255,255,255,0.3)" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                  <Line type="stepAfter" dataKey="pnl" stroke="#2563eb" strokeWidth={4} dot={false} />
                </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-white/50">
          <div className="p-6 px-8 flex justify-between items-center bg-white/20">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-500">History</h3>
            <input type="text" placeholder="Search..." value={logic.searchQuery} onChange={(e) => logic.setSearchQuery(e.target.value)} className="bg-white/50 border border-white rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 ring-blue-500/10 w-48" />
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/10 text-[10px] uppercase font-black tracking-tighter text-slate-400">
              <tr><th className="p-6">Ticker</th><th className="p-6">Type</th><th className="p-6">Entry</th><th className="p-6">Result</th><th className="p-6 text-right">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-white/20 text-sm font-bold">
              {logic.trades.map((t) => (
                <tr key={t.id} className="hover:bg-white/20 transition-colors">
                  <td className="p-6 text-blue-700">{t.ticker}</td>
                  <td className="p-6 text-[10px]"><span className={`px-3 py-1 rounded-full ${t.direction === 'LONG' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{t.direction}</span></td>
                  <td className="p-6 text-slate-500">${parseFloat(t.entryPrice).toFixed(4)}</td>
                  <td className="p-6">
                    {t.netPnL !== null ? <span className={parseFloat(t.netPnL) >= 0 ? 'text-emerald-600' : 'text-rose-600'}>${parseFloat(t.netPnL).toFixed(2)}</span> : <button onClick={() => logic.openCloseModal(t.id)} className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] uppercase">Close</button>}
                  </td>
                  <td className="p-6 text-right text-slate-400 text-xs">{new Date(t.entryDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, color }) => (
  <div className="bg-white/30 backdrop-blur-xl border border-white/60 shadow-xl p-8 rounded-[2rem] flex flex-col items-center ring-1 ring-white/50 group hover:bg-white/50 transition-all">
    <div className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{label}</div>
    <div className={`text-4xl font-black ${color} tracking-tighter`}>{value}</div>
  </div>
);

const Input = ({ label, onChange, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{label}</label>
    <input className="w-full bg-white/50 border border-white rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 ring-blue-500/20 transition-all placeholder:text-slate-300" onChange={(e) => onChange(e.target.value)} {...props} />
  </div>
);

export default App;