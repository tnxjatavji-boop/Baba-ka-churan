import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { triggerHaptic } from '../utils/haptics';
import { 
  ArrowLeft, ShieldCheck, Lock, Cpu, Globe, Award, 
  TrendingUp, CheckCircle2, ChevronRight, HelpCircle, Activity,
  Server, RefreshCw, BarChart2, DollarSign, Clock, Users, Check
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const AboutScreen = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const coreAdvantages = [
    {
      icon: <Cpu className="w-5 h-5 text-blue-600" />,
      title: "Ultra Low-Latency Engine",
      badge: "Sub-Millisecond",
      desc: "Instantaneous trade execution with zero slippage. Our matching engine processes market predictions in real time directly synchronized with global order books."
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      title: "Bank-Grade Asset Safety",
      badge: "256-Bit SSL",
      desc: "User funds are stored in segregated cold reserve vaults with end-to-end cryptographic hashing, multi-sig authorization, and anti-fraud monitoring."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-blue-500" />,
      title: "Instant 24/7 UPI & Bank Payouts",
      badge: "0% Fees",
      desc: "Experience lightning-speed automated deposit recognition and prompt withdrawal dispatch directly to your verified Indian UPI IDs and bank accounts."
    },
    {
      icon: <Globe className="w-5 h-5 text-indigo-500" />,
      title: "Multi-Asset Global Coverage",
      badge: "20+ Pairs",
      desc: "Trade leading Crypto pairs (BTC, ETH, SOL, DOGE), major Forex currencies (EUR/USD, GBP/USD), Commodities (Gold, Crude Oil), and stock market indices."
    },
    {
      icon: <Award className="w-5 h-5 text-purple-500" />,
      title: "Unlimited Free Demo Account",
      badge: "₹10,000 Refill",
      desc: "Test your market instincts and technical candlestick indicators in a risk-free environment. Refill your virtual balance anytime with a single tap."
    },
    {
      icon: <Server className="w-5 h-5 text-rose-500" />,
      title: "99.9% High-Availability SLA",
      badge: "Edge Cloud",
      desc: "Distributed server architecture guarantees continuous trading uptime and price integrity even during high-volatility news spikes."
    }
  ];

  const platformStats = [
    { label: "Active Traders", value: "10,000+", sub: "Verified Traders" },
    { label: "Daily Turnover", value: "₹45 Lakh+", sub: "Active Liquidity" },
    { label: "Avg. Payout", value: "3 - 5 Min", sub: "Automated UPI Dispatch" },
    { label: "System Uptime", value: "99.9%", sub: "High-Availability SLA" },
  ];

  const marketStandards = [
    { title: "Fair Price Feeds", desc: "Live ticks sourced from Binance, Bybit & interbank aggregates without artificial manipulation." },
    { title: "Deterministic Settlement", desc: "Transparent strike and expiry times with verifiable microsecond timestamp logs." },
    { title: "Isolated User Balances", desc: "Your deposits are held in separate escrow accounts, never used for company operations." },
    { title: "Responsible Trading", desc: "Built-in risk limits, stop balance triggers, and trader protection safeguards." }
  ];

  const platformFaqs = [
    {
      q: "What is TradeXora?",
      a: "TradeXora is a premier financial technology and real-time market prediction platform designed to provide traders of all skill levels with high-speed trade execution, accurate price feeds, and a secure financial ecosystem."
    },
    {
      q: "Is my money safe on TradeXora?",
      a: "Yes. All user balances are backed 1:1 in segregated accounts. All transactions are protected with military-grade 256-bit encryption, strict KYC compliance, and multi-layer fraud prevention."
    },
    {
      q: "How does the Demo Practice Account work?",
      a: "Every registered user receives a free ₹10,000 Demo balance. It uses identical real-time market data as the Real Account, allowing you to practice strategies, study chart patterns, and hone your timing without risking real capital."
    },
    {
      q: "What deposit and withdrawal methods are supported?",
      a: "TradeXora natively supports UPI (Google Pay, PhonePe, Paytm, BHIM, Cred) and direct IMPS Bank Transfer with instant automated verification and zero processing fees."
    },
    {
      q: "Are the market prices real?",
      a: "Yes. TradeXora ingests high-frequency tick streams directly from tier-1 liquidity providers and major spot exchanges to guarantee market accuracy and fair payouts."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans select-none overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-3.5 border-b border-gray-100 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { triggerHaptic('light'); navigate(-1); }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-gray-900 tracking-tight">About TradeXora</h1>
            <div className="text-[10px] text-gray-400 font-medium">Platform Guide & Architecture</div>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>v1.0.4 Stable</span>
        </span>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Brand Hero Showcase */}
        <div className="bg-gradient-to-br from-[#0c1427] via-[#111f3d] to-[#0a1020] rounded-3xl p-5 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-3.5 mb-3.5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden bg-white/10 border border-white/20 p-1 backdrop-blur-md shrink-0">
                <BrandLogo className="w-full h-full object-contain rounded-xl" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest font-black text-blue-400">TradeXora Global</div>
                <h2 className="text-xl font-black text-white tracking-tight">Next-Gen Trading Platform</h2>
                <div className="text-[11px] text-slate-300 font-medium">Engineered for Precision & Speed</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium mb-4">
              TradeXora is a cutting-edge financial prediction terminal combining institutional-grade market data feeds, sub-millisecond execution, and automated settlement protocols to deliver the ultimate trading experience.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
              {platformStats.map((stat, i) => (
                <div key={i} className={`p-1.5 ${i % 2 === 1 ? 'border-l border-white/10 pl-3' : ''}`}>
                  <div className="text-lg font-black text-white font-mono">{stat.value}</div>
                  <div className="text-[10px] font-bold text-blue-300/90">{stat.label}</div>
                  <div className="text-[9px] text-slate-400">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Advantages List */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bold text-gray-900 text-sm">Why Traders Choose TradeXora</h3>
            <span className="text-[10px] font-bold text-gray-400">Core Features</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {coreAdvantages.map((adv, idx) => (
              <div key={idx} className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-2xs shrink-0">
                      {adv.icon}
                    </div>
                    <span className="font-bold text-gray-900 text-xs">{adv.title}</span>
                  </div>
                  <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-full">
                    {adv.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed pl-10 font-normal">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Integrity Standards */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl p-4 text-white shadow-xs border border-emerald-900/30">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-emerald-300 text-sm">Security & Fair Trading Commitments</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {marketStandards.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <div className="text-[10px] text-slate-300 leading-snug pl-5">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-gray-700" />
            <h3 className="font-bold text-gray-900 text-sm">Platform Knowledge Base & FAQs</h3>
          </div>

          <div className="space-y-2">
            {platformFaqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-3 text-left flex items-center justify-between bg-gray-50/60 hover:bg-gray-50 transition cursor-pointer"
                >
                  <span className="text-xs font-bold text-gray-800 pr-2">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-3 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center py-4 space-y-1 text-gray-400">
          <div className="text-xs font-bold text-gray-500">TradeXora Platform © 2026. All Rights Reserved.</div>
          <div className="text-[10px]">Encrypted Financial Terminal • Distributed Liquidity Protocol</div>
        </div>

      </div>
    </div>
  );
};
