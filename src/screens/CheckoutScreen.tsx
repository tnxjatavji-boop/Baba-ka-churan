import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Copy, Check, CheckCircle2, QrCode, 
  ExternalLink, ArrowLeft, ArrowUpRight, CreditCard, RefreshCw, Upload, X
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

interface DepositUpi {
  id: string;
  upiId: string;
  name: string;
  bankName: string;
  isActive: boolean;
  isPrimary: boolean;
  createdAt: string;
}

export const CheckoutScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const amountParam = searchParams.get('amount') || '500';
  const queryUserId = searchParams.get('userId') || '';
  
  const [userId] = useState(() => {
    if (queryUserId) return queryUserId;
    try {
      return localStorage.getItem('tradexora_user') || 'user';
    } catch {
      return 'user';
    }
  });

  const amount = Number(amountParam) || 500;
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Screenshot file size must be less than 10MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG, PNG, or WEBP)");
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setScreenshotBase64(compressed);
          } else {
            setScreenshotBase64(reader.result as string);
          }
        };
        img.onerror = () => {
          setScreenshotBase64(reader.result as string);
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Dynamic UPI list fetched from database configured in Admin Panel
  const [upis, setUpis] = useState<DepositUpi[]>([
    { id: "upi_1", upiId: "tradexora0@okhdfcbank", name: "HDFC Official QR", bankName: "HDFC Bank", isActive: true, isPrimary: true, createdAt: "" }
  ]);
  const [selectedUpi, setSelectedUpi] = useState<DepositUpi>({
    id: "upi_1",
    upiId: "tradexora0@okhdfcbank",
    name: "HDFC Official QR",
    bankName: "HDFC Bank",
    isActive: true,
    isPrimary: true,
    createdAt: ""
  });
  const [fetchingUpis, setFetchingUpis] = useState(true);

  // Fetch active UPI accounts from backend database
  useEffect(() => {
    const fetchUpis = async () => {
      try {
        const res = await fetch('/api/upi_ids');
        const data = await res.json();
        if (data.success) {
          const chosen = data.singleUpi || data.rotatedUpi || data.primaryUpi || (Array.isArray(data.upis) ? data.upis[0] : null);
          if (chosen) setSelectedUpi(chosen);
        }
      } catch (err) {
        console.error("Error fetching deposit UPI IDs:", err);
      } finally {
        setFetchingUpis(false);
      }
    };
    fetchUpis();
  }, []);

  const activeUpiId = selectedUpi?.upiId || 'tradexora0@okhdfcbank';

  // Standard UPI deep link URLs
  const baseUpiParams = `pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(selectedUpi?.name || 'TradeX Ora')}&am=${amount}&cu=INR&tn=TradeXora%20Deposit%20${userId}`;
  const upiIntentUrl = `upi://pay?${baseUpiParams}`;
  const phonePeIntentUrl = `phonepe://pay?${baseUpiParams}`;
  const gPayIntentUrl = `tez://upi/pay?${baseUpiParams}`;
  const paytmIntentUrl = `paytmmp://pay?${baseUpiParams}`;
  const bhimIntentUrl = `bhim://pay?${baseUpiParams}`;

  // Dynamic QR Code URL based on selected UPI and amount
  const getQrUrl = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(upiIntentUrl)}`;
  };

  // Mask UPI ID leaving the last few characters (e.g. •••••••••0@okaxis)
  const getMaskedUpiId = (rawUpi: string) => {
    if (!rawUpi) return '';
    const atIndex = rawUpi.indexOf('@');
    if (atIndex > 0) {
      const userPart = rawUpi.slice(0, atIndex);
      const handlePart = rawUpi.slice(atIndex); // e.g. '@okaxis'
      const visibleTail = userPart.length > 3 ? 1 : 0;
      const maskCount = Math.max(5, userPart.length - visibleTail);
      return '•'.repeat(maskCount) + (visibleTail ? userPart.slice(-visibleTail) : '') + handlePart;
    }
    if (rawUpi.length <= 4) return rawUpi;
    return '•'.repeat(Math.max(4, rawUpi.length - 4)) + rawUpi.slice(-4);
  };

  const handleCopyUpi = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(activeUpiId);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = activeUpiId;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      alert("Please enter the 12-digit UTR / Reference ID from your UPI payment receipt.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'user',
          amount,
          utr: cleanUtr,
          screenshotBase64: screenshotBase64 || '',
          upiId: activeUpiId
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || "Failed to submit deposit verification.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans select-none text-gray-900">
      
      {/* Top Header */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-xs p-0.5 shrink-0">
            <BrandLogo className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900">TradeXora Payment</h1>
            <p className="text-[11px] text-gray-500 font-medium">Secure UPI Gateway</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.close()}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Close Tab
        </button>
      </div>

      {/* Main Payment Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
        
        {/* Amount Summary */}
        <div className="bg-gradient-to-br from-[#0088cc] to-blue-700 rounded-xl p-4 text-white text-center">
          <div className="text-xs uppercase font-bold tracking-wider opacity-90">Amount to Pay</div>
          <div className="text-3xl font-black mt-0.5">
            ₹{amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] opacity-80 mt-1">
            Account: {userId}
          </div>
        </div>

        {!submitted ? (
          <>
            {/* Quick 1-Click Pay Buttons */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-gray-700">Pay directly with your UPI App:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={phonePeIntentUrl}
                  className="flex items-center justify-center gap-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl py-2 px-2 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  <span>PhonePe</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={gPayIntentUrl}
                  className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl py-2 px-2 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  <span>Google Pay</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={paytmIntentUrl}
                  className="flex items-center justify-center gap-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 rounded-xl py-2 px-2 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  <span>Paytm</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={upiIntentUrl}
                  className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl py-2 px-2 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  <span>Any UPI App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-bold text-gray-800 mb-1">
                Scan QR Code to Pay ₹{amount.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-gray-500 mb-2">
                Receiving via: <strong className="text-gray-800">{selectedUpi?.name} ({selectedUpi?.bankName})</strong>
              </div>

              <div className="bg-white p-2 rounded-xl shadow-xs border border-gray-200 inline-block">
                <img 
                  src={getQrUrl()} 
                  alt={`QR ₹${amount}`} 
                  className="w-44 h-44 object-contain rounded-lg"
                />
              </div>

              <div className="text-[11px] text-gray-500 mt-2.5 font-medium">
                Open GPay, PhonePe, Paytm, BHIM or any UPI App to scan.
              </div>

              {/* Copy UPI ID */}
              <div className="mt-3 w-full">
                <div className="text-[11px] text-gray-600 font-semibold mb-1 text-left">
                  Or pay directly to UPI ID:
                </div>
                <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-gray-200">
                  <span 
                    className="font-mono text-xs font-bold text-gray-800 tracking-wider truncate mr-2"
                    title="Click Copy to copy complete UPI ID"
                  >
                    {getMaskedUpiId(activeUpiId)}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    title="Copy full UPI ID"
                    className="flex items-center gap-1 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

              {/* Step 2: UTR Submission & Optional Screenshot Upload */}
              <form onSubmit={handleSubmitDeposit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Enter 12-Digit UTR / Reference ID: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                    placeholder="e.g. 427812948192"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0088cc]/20 focus:border-[#0088cc]"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Found in your payment receipt / SMS as UTR or Ref No.</p>
                </div>

                {/* Screenshot Upload Field (Optional / Auto-OCR) */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Payment Screenshot (Optional for Instant Auto-Credit):
                  </label>
                  {screenshotBase64 ? (
                    <div className="relative border border-emerald-300 bg-emerald-50/50 rounded-xl p-2.5 flex items-center gap-2.5">
                      <img 
                        src={screenshotBase64} 
                        alt="Screenshot" 
                        className="w-12 h-12 object-cover rounded-lg border border-emerald-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-emerald-800 truncate">
                          {screenshotFileName || 'Screenshot.png'}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">Ready for OCR scanner</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScreenshotBase64(null)}
                        className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-300 hover:border-[#0088cc] bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                      <input 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 text-[#0088cc] mb-1" />
                      <span className="text-xs font-bold text-gray-800">Attach Payment Screenshot (Optional)</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WEBP for fast automated OCR</span>
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || utrNumber.trim().length < 6}
                  className="w-full bg-[#0088cc] hover:bg-[#0077b5] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit & Verify Deposit</span>
                    </>
                  )}
                </button>
              </form>
          </>
        ) : (
          /* Submission Success State */
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">Deposit Request Submitted!</h2>
              <p className="text-xs text-gray-600 mt-1">
                Your payment of <strong>₹{amount.toLocaleString('en-IN')}</strong> with UTR <strong>{utrNumber}</strong> has been submitted. It will be credited as soon as verified.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.close()}
              className="mt-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
            >
              Close this Tab
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] text-gray-400 pt-2 border-t border-gray-100 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Guaranteed Safe Deposit & Anti-Fraud Protection</span>
        </div>

      </div>
    </div>
  );
};
