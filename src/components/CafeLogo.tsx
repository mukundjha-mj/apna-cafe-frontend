import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export default function CafeLogo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const cafeName = useSelector((state: RootState) => state.menu.cafeName);
  const h = size === 'large' ? 48 : 36;
  const fontSize = size === 'large' ? '1.3rem' : '1.05rem';
  const subSize = size === 'large' ? '0.6rem' : '0.48rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {/* Icon */}
      <div style={{
        width: h, height: h, borderRadius: '12px',
        background: 'linear-gradient(135deg, #FF7622, #FF9A53)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(255,118,34,0.3)',
      }}>
        <svg width={h * 0.55} height={h * 0.55} viewBox="0 0 24 24" fill="none">
          {/* Cup body */}
          <path d="M4 10h12v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-8z" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Handle */}
          <path d="M16 12h1.5a2.5 2.5 0 010 5H16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Saucer */}
          <path d="M2 22h16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Steam 1 */}
          <path d="M7 7c0-1.5 2-1.5 2-3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.8"/>
          {/* Steam 2 */}
          <path d="M11 6c0-1.5 2-1.5 2-3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
          {/* Steam 3 */}
          <path d="M15 7c0-1 1-1 1-2" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{
          fontWeight: 800,
          fontSize,
          color: 'inherit', /* Use parent color or explicit color */
          letterSpacing: '-0.3px',
          fontFamily: "'Poppins', sans-serif",
        }}>
          {cafeName?.split(' ')[0] || 'Apna'}<span style={{ color: '#FF7622' }}>{cafeName?.split(' ').slice(1).join(' ') || 'Cafe'}</span>
        </span>
        <span style={{
          fontSize: subSize,
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: 500,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}>
          Good Food • Good Mood
        </span>
      </div>
    </div>
  );
}
