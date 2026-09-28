import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, ChevronDown, ChevronUp, 
  ExternalLink, CheckCircle2, Search, Headphones,
  ShieldCheck, CreditCard, Wallet, ArrowDownLeft, ArrowUpRight,
  HelpCircle, UserCheck, RefreshCw, AlertCircle, FileText
} from 'lucide-react';

interface FAQ {
  id: string;
  category: 'Deposits' | 'Withdrawals' | 'Trading Rules' | 'Account & Turnover' | 'Security';
  q: string;
  a: string;
  highlight?: string;
}

const FAQS: FAQ[] = [
  {
    id: 'f1',
    category: 'Withdrawals',
    q: 'How to withdraw money to my bank account?',
    a: 'Withdrawals on TradeXora are processed strictly to your Indian Bank Account via IMPS / NEFT (UPI withdrawals are not supported).\n\n• Minimum Withdrawal: ₹200 (Maximum: ₹5,00,000/day)\n• Processing Fee: 4% standard bank gateway processing charge\n• Payout Speed: 15 to 30 minutes straight into your bank account\n\nHow to request:\n1. Go to Profile or Wallet > Withdraw.\n2. Enter withdrawal amount and click "Next: Enter Bank Details".\n3. Select your Bank, enter Account Holder Name, Account Number, and IFSC Code.\n4. Click "Confirm Withdrawal Request".',
    highlight: 'Strictly Bank IMPS Only • 4% Fee • 15-30 Min'
  },
  {
    id: 'f2',
    category: 'Withdrawals',
    q: 'What are the withdrawal limits and processing fees?',
    a: '• Minimum Withdrawal: ₹200 per request\n• Maximum Daily Limit: ₹5,00,000 per day\n• Processing Fee: 4% bank gateway fee (deducted from payout amount)\n• Payouts are dispatched 24/7 via express IMPS bank gateway.',
    highlight: 'Min ₹200 • 4% Processing Fee'
  },
  {
    id: 'f3',
    category: 'Withdrawals',
    q: 'Why is my withdrawal pending or delayed?',
    a: 'Common reasons for withdrawal delays or rejections:\n1. Incorrect Bank Account Number or IFSC Code.\n2. Incomplete Turnover (Wager Target) on your account.\n3. Bank IMPS server downtime.\n\nIf your withdrawal has been pending for over 30 minutes, tap "Open Live Support" below to contact our Telegram Support Bot with your Registered Email / User ID for immediate priority push.',
    highlight: 'Bank Account & Turnover Check'
  },
  {
    id: 'f4',
    category: 'Deposits',
    q: 'How to deposit funds via UPI and get balance credited?',
    a: 'Deposit Steps:\n1. Go to Trade > Deposit.\n2. Choose an amount (₹100 to ₹50,000) and scan the dynamic QR using PhonePe, Google Pay, Paytm, or BHIM.\n3. Copy the 12-digit UTR / Reference Number from your payment receipt.\n4. Paste the 12-digit UTR on the Deposit page and tap "Verify Deposit".\n\nFunds are automatically credited to your Real Wallet within 2 to 5 minutes.',
    highlight: 'Auto-Credit in 2-5 min via 12-digit UTR'
  },
  {
    id: 'f5',
    category: 'Deposits',
    q: 'What if deposit balance is not credited after submitting UTR?',
    a: 'If funds were deducted from your bank but haven\'t reflected in your wallet:\n• Verify that you entered the full 12-digit UTR correctly.\n• Keep your payment screenshot / receipt ready.\n• Tap "Open Live Support" below to send the receipt to our Telegram Support Executive. Your wallet will be credited within 1-2 minutes after verification.',
    highlight: '24/7 Telegram Receipt Verification'
  },
  {
    id: 'f6',
    category: 'Account & Turnover',
    q: 'What is Turnover (Wager Target) and how to complete it?',
    a: 'Turnover is the trading volume requirement applied to deposits or bonuses for platform security and fair-play.\n\nHow to complete:\n• Place trades in your Real Account (both Winning and Losing trades count 100% towards turnover).\n• Once the turnover progress reaches 100%, withdrawals are immediately unlocked.\n• Check your live turnover progress bar anytime on the Profile > Withdraw page.',
    highlight: 'Trade in Real Account to Unlock'
  },
  {
    id: 'f7',
    category: 'Trading Rules',
    q: 'How does Binary Options Trading work and what is the payout?',
    a: 'Binary Options is a fixed-time market prediction:\n1. Select an asset (Crypto, Forex, Stocks, Gold).\n2. Choose expiry duration (5s, 15s, 30s, 1m, 2m, 5m, 15m).\n3. Tap UP (CALL) if you predict the price will rise above your entry strike, or DOWN (PUT) if you predict it will fall.\n4. Winning trades yield up to 88% instant net profit credited to your Real Wallet.',
    highlight: 'Up to 88% Payout per Winning Trade'
  },
  {
    id: 'f8',
    category: 'Account & Turnover',
    q: 'How does the Demo Account work and how to refill?',
    a: '• Demo Account: Comes with ₹10,000 free virtual practice balance.\n• Unlimited Refill: When your demo balance gets low, click the Refill (↻) button next to the balance at the top to reload ₹10,000 for free unlimited times.',
    highlight: 'Unlimited ₹10,000 Demo Refill'
  },
  {
    id: 'f9',
    category: 'Security',
    q: 'Are my funds and banking details safe on TradeXora?',
    a: 'Yes. TradeXora uses 256-Bit Bank-Grade SSL encryption and segregated cold liquidity vaults. Your bank credentials are encrypted and strictly used for IMPS payout processing.',
    highlight: '256-Bit Bank Grade SSL Encryption'
  },
  {
    id: 'f10',
    category: 'Trading Rules',
    q: 'Is KYC or document upload required for trading or withdrawals?',
    a: 'No heavy KYC or Aadhaar/PAN upload is required to trade or withdraw. Only an active, accurate Indian Bank Account (Account Number + IFSC) is needed for payouts.',
    highlight: 'No KYC Hassles • Fast Direct Bank Payouts'
  }
];

const QUICK_PROMPTS = [
  "How to withdraw to bank?",
  "UPI Deposit & UTR help",
  "How to complete turnover?",
  "How to refill Demo Account?",
  "Withdrawal status & delay help",
  "Chat with Telegram Live Support"
];

const TELEGRAM_SUPPORT_BOT_URL = "https://t.me/tradexora_supportbot";

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
  showLiveButton?: boolean;
}

export const HelpScreen = () => {
  const [tab, setTab] = useState<'chat' | 'knowledge' | 'ticket'>('chat');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<string | null>('f1');

  // Support Ticket Form State
  const [ticketCategory, setTicketCategory] = useState('Withdrawal to Bank Issue');
  const [ticketRef, setTicketRef] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! Welcome to TradeXora 24/7 Official Support Desk.\n\nYou can ask about Bank Withdrawals, UPI Deposits, UTR verification, Turnover progress, Demo balance refill, or account security.\n\nIf your query requires personalized account assistance, tap "Open Live Support" to chat directly with our Telegram Executive.',
      time: 'Just now',
      showLiveButton: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, tab]);

  const generateSmartReply = (userQuery: string): { reply: string; showLiveButton: boolean } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Direct Human / Live Support / Telegram requests
    if (
      q.includes('live') || q.includes('human') || q.includes('agent') || 
      q.includes('telegram') || q.includes('bot') || q.includes('contact') || 
      q.includes('call') || q.includes('phone') || q.includes('number') || 
      q.includes('executive') || q.includes('help line') || q.includes('custmer') || 
      q.includes('customer care') || q.includes('talk') || q.includes('speak')
    ) {
      return {
        reply: "📞 TradeXora Official 24/7 Live Support:\n\nYou can connect directly with our live support executive on Telegram (@tradexora_supportbot) by tapping the button below.\n\n• Response Time: < 2 Minutes\n• Availability: 24 Hours, 7 Days a Week",
        showLiveButton: true
      };
    }

    // 2. Withdrawal Queries (Strictly Bank Account)
    if (
      q.includes('withdraw') || q.includes('bank') || q.includes('payout') || 
      q.includes('cashout') || q.includes('imps') || q.includes('neft') || 
      q.includes('ifsc') || q.includes('account no') || q.includes('minimum withdraw') || 
      q.includes('min withdraw') || q.includes('fee') || q.includes('charge')
    ) {
      if (q.includes('delay') || q.includes('late') || q.includes('pending') || q.includes('time') || q.includes('how long') || q.includes('status')) {
        return {
          reply: "⏱️ Bank Withdrawal Timeline & Status:\n\n• Processing Speed: 15 to 30 minutes via Direct IMPS Bank Gateway.\n• If your withdrawal is pending for over 30 minutes, please verify your Bank Account Number and IFSC Code.\n• If details are correct, tap 'Open Live Support' below and send your Registered Email or User ID to our Telegram Support Bot for an instant priority push.",
          showLiveButton: true
        };
      }
      if (q.includes('reject') || q.includes('fail') || q.includes('cancel')) {
        return {
          reply: "❌ Withdrawal Rejection / Failure Reasons:\n\n1. Incorrect Bank Account Number or IFSC Code.\n2. Incomplete Turnover (Wager Target) on your account.\n3. Bank IMPS server gateway rejection.\n\nDon't worry, rejected funds are instantly refunded back to your Real Wallet. You can re-check your bank details and submit a new request or contact Telegram Support.",
          showLiveButton: true
        };
      }
      return {
        reply: "🏦 Bank Withdrawal Rules & Process:\n\n• Payout Method: Strictly Direct Bank Account (IMPS / NEFT Transfer).\n• Minimum Limit: ₹200 (Maximum: ₹5,00,000/day).\n• Processing Fee: 4% standard bank gateway processing charge.\n• Processing Speed: 15 to 30 minutes directly into your bank account.\n\nHow to request:\n1. Go to Profile > Withdraw.\n2. Enter withdrawal amount and click 'Next: Enter Bank Details'.\n3. Select your Bank, enter Account Holder Name, Account Number, and IFSC Code.\n4. Click 'Confirm Withdrawal Request'.",
        showLiveButton: true
      };
    }

    // 3. Deposit & UTR Verification Queries
    if (
      q.includes('deposit') || q.includes('utr') || q.includes('add money') || 
      q.includes('qr') || q.includes('phonepe') || q.includes('gpay') || 
      q.includes('paytm') || q.includes('recharge') || q.includes('payment') || 
      q.includes('minimum deposit') || q.includes('min deposit')
    ) {
      if (q.includes('not credit') || q.includes('not received') || q.includes('failed') || q.includes('stuck') || q.includes('problem') || q.includes('issue')) {
        return {
          reply: "⚠️ Deposit / UTR Issue Resolution:\n\nIf funds were debited from your UPI app but have not reflected in your TradeXora wallet:\n1. Verify that you entered the full 12-digit UTR number correctly.\n2. If balance is not added within 5 minutes, tap 'Open Live Support' below to send your payment screenshot and 12-digit UTR.\n3. Our support executive will verify your receipt and credit your wallet within 1-2 minutes.",
          showLiveButton: true
        };
      }
      return {
        reply: "💳 UPI Deposit & UTR Verification Process:\n\n• Minimum Deposit: ₹100 | Maximum: ₹50,000 per transaction.\n• Payment Methods: PhonePe, Google Pay, Paytm, BHIM, or any UPI app.\n\nDeposit Steps:\n1. Go to Trade > Deposit and select an amount.\n2. Scan the dynamic QR code on screen with your UPI app and complete the payment.\n3. Copy the 12-digit UTR / Reference No. from your payment receipt.\n4. Paste the 12-digit UTR on the Deposit page and click 'Verify Deposit'. Balance is credited in 2-5 minutes.",
        showLiveButton: true
      };
    }

    // 4. Turnover & Wager Requirements
    if (
      q.includes('turnover') || q.includes('wager') || q.includes('lock') || 
      q.includes('unblock') || q.includes('unlock') || q.includes('target') || 
      q.includes('requirement')
    ) {
      return {
        reply: "📊 Turnover (Wager Target) Complete Guide:\n\n• What is Turnover? A trading volume requirement applied to deposits and bonuses to prevent fraudulent activity and ensure platform security.\n• How to complete? Place trades in your Real Account. Every trade placed (both Wins and Losses) counts 100% towards turnover.\n• Once your turnover reaches 100%, withdrawals are immediately unlocked.\n• Check your live turnover progress bar anytime on the Profile > Withdraw page.",
        showLiveButton: false
      };
    }

    // 5. Demo Account & Free Practice Refill
    if (
      q.includes('demo') || q.includes('refill') || q.includes('practice') || 
      q.includes('free') || q.includes('10000') || q.includes('reload') || 
      q.includes('virtual')
    ) {
      return {
        reply: "🎮 Demo Account Free Practice & Refill:\n\n• Every user receives ₹10,000 in free virtual practice funds.\n• If your demo balance runs low:\n  → Click the 'Demo' tab in the top navigation bar.\n  → Click the Refill (↻) icon next to the balance.\n  → Your balance will instantly reload to ₹10,000 for free (unlimited refills).",
        showLiveButton: false
      };
    }

    // 6. Binary Trading Rules & Payout Calculation
    if (
      q.includes('trade') || q.includes('call') || q.includes('put') || 
      q.includes('payout') || q.includes('binary') || q.includes('how to play') || 
      q.includes('profit') || q.includes('duration') || q.includes('timeframe') || 
      q.includes('strike') || q.includes('expiry')
    ) {
      return {
        reply: "📈 Binary Trading Rules & Payouts:\n\n• Durations: 5s, 15s, 30s, 1m, 2m, 5m, 15m fixed-time expiries.\n• UP (CALL / Green): If you predict the market price will be higher than your entry price at expiry.\n• DOWN (PUT / Red): If you predict the market price will be lower than your entry price at expiry.\n• Payout: Winning trades earn between 80% to 88% instant net profit credited directly to your Real Wallet.",
        showLiveButton: false
      };
    }

    // 7. KYC / Document Verification
    if (
      q.includes('kyc') || q.includes('document') || q.includes('aadhar') || 
      q.includes('pan') || q.includes('verify') || q.includes('identity') || 
      q.includes('proof') || q.includes('id card')
    ) {
      return {
        reply: "🆔 KYC & Documentation Policy:\n\n• No heavy KYC or Aadhaar/PAN document uploads are required to trade or withdraw on TradeXora.\n• Only a valid Indian Bank Account (Account Number + IFSC) is required for payout dispatch.",
        showLiveButton: false
      };
    }

    // 8. Account Security & Fund Safety
    if (
      q.includes('safe') || q.includes('security') || q.includes('fraud') || 
      q.includes('secure') || q.includes('legal') || q.includes('trust')
    ) {
      return {
        reply: "🔒 Fund Safety & Security Protocol:\n\n• 256-Bit Bank-Grade SSL encryption on all platform data.\n• Client funds stored in 100% segregated liquid reserves.\n• Direct automated IMPS bank payout guarantee.",
        showLiveButton: false
      };
    }

    // 9. Account Access, Password & Login
    if (
      q.includes('login') || q.includes('password') || q.includes('register') || 
      q.includes('account') || q.includes('forgot') || q.includes('email') || 
      q.includes('otp') || q.includes('reset') || q.includes('sign in')
    ) {
      return {
        reply: "🔑 Account Login & Password Assistance:\n\n• You can login anytime using your registered Email and Password.\n• If you forgot your password or need email assistance, please contact our Telegram Support Bot directly. Our team will verify your account and reset your access in minutes.",
        showLiveButton: true
      };
    }

    // 10. App Installation & PWA (APK / Android)
    if (
      q.includes('app') || q.includes('apk') || q.includes('download') || 
      q.includes('install') || q.includes('android') || q.includes('ios')
    ) {
      return {
        reply: "📱 TradeXora Mobile App & PWA:\n\n• TradeXora is a high-speed Progressive Web App (PWA) installable directly on any mobile device.\n• To install: Open in Chrome > Tap the 3 dots (⋮) top right > Tap 'Add to Home Screen' or 'Install App'.",
        showLiveButton: false
      };
    }

    // 11. Referral & Bonus Rules
    if (
      q.includes('refer') || q.includes('bonus') || q.includes('promo') || 
      q.includes('reward') || q.includes('commission') || q.includes('code')
    ) {
      return {
        reply: "🎁 Bonuses & Promotions:\n\n• Promotional bonuses and deposit rewards are credited to your active wallet.\n• Turnover rules apply to bonus funds. Once turnover is met, all profits are 100% withdrawable to your bank account.",
        showLiveButton: false
      };
    }

    // Default Fallback
    return {
      reply: "TradeXora Support Desk:\n\nOur support desk is active 24/7. If you require live assistance with your account, pending deposit, or withdrawal, please tap 'Open Live Support' below to chat directly with our Telegram Support Executive.",
      showLiveButton: true
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    if (query === "Chat with Telegram Live Support" || query.includes("Telegram Support Bot")) {
      window.open(TELEGRAM_SUPPORT_BOT_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: query, time: now }]);
    if (!textToSend) setInputMessage('');

    setTimeout(() => {
      const { reply, showLiveButton } = generateSmartReply(query);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showLiveButton
        }
      ]);
    }, 350);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    const ticketId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketSubmitted(ticketId);
  };

  const filteredFaqs = FAQS.filter(f => {
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch = f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans overflow-hidden select-none">
      {/* Top Header */}
      <div className="px-4 pt-[max(env(safe-area-inset-top,0px),12px)] pb-2.5 bg-white border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-base font-black text-gray-900 tracking-tight leading-none truncate">
              Help & Support
            </h1>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              24/7 Official Desk
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setTab('chat')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${tab === 'chat' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setTab('knowledge')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${tab === 'knowledge' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'}`}
            >
              FAQs
            </button>
            <button
              onClick={() => setTab('ticket')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${tab === 'ticket' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'}`}
            >
              Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: AI & Live Chat Assistant */}
      {tab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 mt-0.5 border border-gray-200">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-line shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gray-900 text-white rounded-tr-xs font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-xs leading-relaxed font-normal'
                  }`}
                >
                  <div>{msg.text}</div>

                  {/* Direct Telegram Live Support Action inside Bot Message */}
                  {msg.showLiveButton && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100">
                      <a
                        href={TELEGRAM_SUPPORT_BOT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Open Live Support (@tradexora_supportbot)</span>
                        <ExternalLink className="w-3 h-3 text-white/80 ml-0.5" />
                      </a>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1.5 text-right font-semibold ${
                      msg.sender === 'user' ? 'text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 items-center">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className={`whitespace-nowrap text-[11px] font-bold px-3 py-1 rounded-full transition-colors cursor-pointer border shrink-0 ${
                  prompt.includes("Telegram") 
                    ? "bg-blue-50 text-[#0088cc] border-blue-200 hover:bg-blue-100"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-gray-200 flex gap-2 items-center shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about bank withdrawal, deposit, turnover, rules..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-gray-900 disabled:opacity-40 hover:bg-black text-white p-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Knowledge Base & FAQs */}
      {tab === 'knowledge' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bank withdrawal, deposit, turnover, rules..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 shadow-xs"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Withdrawals', 'Deposits', 'Account & Turnover', 'Trading Rules', 'Security'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-gray-900 text-white shadow-xs' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-2">
            {filteredFaqs.map(faq => {
              const isOpen = activeFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full p-3.5 text-left flex justify-between items-center hover:bg-gray-50/60 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {faq.category}
                        </span>
                        {faq.highlight && (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            • {faq.highlight}
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-xs text-gray-900 leading-snug">
                        {faq.q}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 whitespace-pre-line bg-gray-50/40">
                      {faq.a}
                      
                      <div className="mt-3 pt-2.5 border-t border-gray-200/80 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Still need help?</span>
                        <a
                          href={TELEGRAM_SUPPORT_BOT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0088cc] font-bold text-[11px] flex items-center gap-1 hover:underline"
                        >
                          <span>Ask Telegram Support Bot</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Submit Support Ticket */}
      {tab === 'ticket' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
          {ticketSubmitted ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center shadow-xs space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Support Ticket Created</h3>
                <p className="text-xs text-gray-500 mt-0.5">Ticket ID: <strong className="text-gray-900">{ticketSubmitted}</strong></p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-bold text-gray-800">{ticketCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-bold text-amber-600">● In Queue (&lt; 15 min response)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTicketSubmitted(null);
                    setTicketRef('');
                    setTicketDesc('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                >
                  New Request
                </button>
                <a
                  href={TELEGRAM_SUPPORT_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram Live Bot</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div>
                <h2 className="text-sm font-black text-gray-900">Submit Priority Support Ticket</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Get direct assistance from our operations desk.</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option>Bank Withdrawal Delay / Issue</option>
                  <option>Deposit / UTR Verification</option>
                  <option>Turnover / Wager Target Clarification</option>
                  <option>Account Access & Security</option>
                  <option>Other Operational Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Reference ID (UTR / Tx ID / Account No)</label>
                <input
                  type="text"
                  value={ticketRef}
                  onChange={(e) => setTicketRef(e.target.value)}
                  placeholder="e.g. 423871982341 (Optional)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Description of Issue</label>
                <textarea
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!ticketDesc.trim()}
                  className="flex-1 bg-gray-900 disabled:opacity-40 hover:bg-black text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Submit Ticket
                </button>
                <a
                  href={TELEGRAM_SUPPORT_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#0088cc] hover:bg-[#0077b5] text-white px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Live Bot</span>
                </a>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
