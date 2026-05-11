import React, { useState } from 'react';
import { tradeApi } from '../api/trades';
import { Activity, Loader2, ArrowRight, ShieldCheck, BarChart3, Clock } from 'lucide-react';

export const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to Register for SaaS feel
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = isLogin 
        ? await tradeApi.login({ email, password })
        : await tradeApi.register({ email, password });
      
      localStorage.setItem('token', data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message ? JSON.parse(err.message).error : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative overflow-hidden">
      
      {/* BACKGROUND BLOBS FOR GLASSMORPHISM */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[100px]"></div>

      {/* TOP NAVIGATION */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tight">
          <Activity className="text-blue-600" /> TradePro
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-medium text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="bg-white/70 hover:bg-white backdrop-blur-md border border-white shadow-sm text-slate-700 px-5 py-2 rounded-full text-sm font-bold transition-all"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </nav>

      {/* HERO SECTION & FORM */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-12 flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT: SaaS PROMOTIONAL COPY */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
            V 2.0 Live
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
            Journal Your Trades. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Master Your Psychology.</span>
          </h1>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The premium minimalist trading journal built for serious professionals. Track equity curves, analyze win rates, and elevate your edge with military-grade security.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm font-bold text-slate-600">
            <div className="flex items-center gap-2"><ShieldCheck className="text-green-500" size={18}/> Bank-grade Encryption</div>
            <div className="flex items-center gap-2"><BarChart3 className="text-blue-500" size={18}/> Live Analytics</div>
            <div className="flex items-center gap-2"><Clock className="text-purple-500" size={18}/> Real-time Sync</div>
          </div>
        </div>

        {/* RIGHT: GLASSMORPHISM LOGIN CARD */}
        <div className="w-full max-w-md">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Start your journey'}
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              {isLogin ? 'Enter your details to access your dashboard.' : 'No credit card required. Free forever.'}
            </p>
            
            {error && <div className="bg-red-50 text-red-500 border border-red-100 p-3 rounded-xl mb-6 text-sm text-center font-bold">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required 
                  className="w-full bg-white/50 border border-white focus:border-blue-400 focus:bg-white rounded-xl p-3.5 text-slate-800 outline-none focus:ring-4 ring-blue-500/10 transition-all shadow-sm" 
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Password</label>
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} 
                  className="w-full bg-white/50 border border-white focus:border-blue-400 focus:bg-white rounded-xl p-3.5 text-slate-800 outline-none focus:ring-4 ring-blue-500/10 transition-all shadow-sm" 
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2 mt-2">
                {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : <>Create Account <ArrowRight size={18}/></>)}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};