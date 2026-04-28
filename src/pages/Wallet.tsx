import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { Wallet as WalletIcon, Gift, Copy, Check, ChevronLeft, ArrowUpRight, ArrowDownLeft, Share2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Transaction {
  id: string;
  amount: number;
  type: 'EARNED' | 'SPENT';
  reason: string;
  createdAt: string;
}

export default function Wallet() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState<{ balance: number, referralCode: string, transactions: Transaction[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_URL}/api/wallet/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWalletData(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch wallet data:', err);
        setLoading(false);
      });
  }, [user?.id]);

  const copyToClipboard = () => {
    if (walletData?.referralCode) {
      navigator.clipboard.writeText(walletData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferral = () => {
    if (walletData?.referralCode) {
      const text = `Hey! Use my referral code ${walletData.referralCode} to get ₹20 discount on your first order at Apna Cafe!`;
      if (navigator.share) {
        navigator.share({
          title: 'Apna Cafe Referral',
          text: text,
          url: window.location.origin
        });
      } else {
        copyToClipboard();
      }
    }
  };

  if (loading) return <div className="page text-center" style={{ padding: '4rem 0' }}>Loading wallet...</div>;

  return (
    <div className="page animate-fade-in" id="wallet-page" style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--typo-300)' }}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Wallet</h2>
      </div>

      {/* Wallet Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '2rem',
        padding: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        marginBottom: '2rem'
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,118,34,0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '100px', height: '100px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <WalletIcon size={14} /> Total Balance
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>₹</span>
            {walletData?.balance || 0}
          </div>
          <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', opacity: 0.6, fontWeight: 500 }}>
            Powered by Apna Cafe Rewards
          </div>
        </div>
      </div>

      {/* Refer & Earn Section */}
      <div style={{ 
        background: '#fff7ed', 
        borderRadius: '1.5rem', 
        padding: '1.5rem', 
        border: '1.5px dashed #fdba74',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
            <Gift size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#9a3412' }}>Refer & Earn ₹20</h4>
            <p style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: 500 }}>When they complete their first order</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ 
            flex: 1, 
            background: 'white', 
            borderRadius: '1rem', 
            padding: '0.75rem 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: '1px solid #fed7aa'
          }}>
            <span style={{ fontWeight: 800, color: '#f97316', fontSize: '1rem', letterSpacing: '2px' }}>{walletData?.referralCode || '------'}</span>
            <button onClick={copyToClipboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f97316' }}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <button onClick={shareReferral} style={{ 
            width: 50, 
            height: 50, 
            borderRadius: '1rem', 
            background: '#f97316', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Transactions History */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Recent Activity</h3>
        <div className="stack" style={{ gap: '0.75rem' }}>
          {walletData?.transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.3 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>No transactions yet</p>
            </div>
          ) : (
            walletData?.transactions.map(tx => (
              <div key={tx.id} style={{ 
                background: 'white', 
                borderRadius: '1.25rem', 
                padding: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    background: tx.type === 'EARNED' ? '#ecfdf5' : '#fff1f2',
                    color: tx.type === 'EARNED' ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tx.type === 'EARNED' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{tx.reason === 'REFERRAL' ? 'Referral Reward' : tx.reason === 'ORDER_PAYMENT' ? 'Paid for Order' : tx.reason}</h5>
                    <p style={{ fontSize: '0.65rem', color: 'var(--typo-100)' }}>{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 800, 
                  color: tx.type === 'EARNED' ? '#10b981' : '#111827' 
                }}>
                  {tx.type === 'EARNED' ? '+' : '-'}₹{tx.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
