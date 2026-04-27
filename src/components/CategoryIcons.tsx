import type { ReactNode } from 'react';

const icons: Record<string, ReactNode> = {
  all: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Plate */}
      <ellipse cx="32" cy="38" rx="26" ry="8" fill="#E8E8E8"/>
      <ellipse cx="32" cy="36" rx="24" ry="7" fill="#F5F5F5"/>
      <ellipse cx="32" cy="35" rx="18" ry="5" fill="#fff"/>
      {/* Fork */}
      <g transform="translate(18, 8)">
        <rect x="2" y="16" width="2.5" height="20" rx="1" fill="#B0B0B0"/>
        <rect x="0" y="4" width="2" height="14" rx="1" fill="#C0C0C0"/>
        <rect x="5" y="4" width="2" height="14" rx="1" fill="#C0C0C0"/>
        <rect x="2.5" y="0" width="2" height="14" rx="1" fill="#C0C0C0"/>
      </g>
      {/* Knife */}
      <g transform="translate(38, 8)">
        <rect x="2" y="16" width="2.5" height="20" rx="1" fill="#B0B0B0"/>
        <path d="M2 4 Q5 2 6 8 L6 18 L2 18 Z" fill="#D0D0D0"/>
      </g>
    </svg>
  ),
  pizza: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Crust shadow */}
      <path d="M32 6 L58 54 L6 54 Z" fill="#D4892A"/>
      {/* Cheese base */}
      <path d="M32 8 L56 52 L8 52 Z" fill="#FFCB4A"/>
      {/* Sauce edge */}
      <path d="M32 12 L52 48 L12 48 Z" fill="#E8444A"/>
      {/* Cheese top */}
      <path d="M32 14 L50 46 L14 46 Z" fill="#FFD966"/>
      {/* Pepperoni */}
      <circle cx="28" cy="34" r="4.5" fill="#C0392B"/>
      <circle cx="38" cy="38" r="4" fill="#C0392B"/>
      <circle cx="32" cy="24" r="3.5" fill="#C0392B"/>
      {/* Olive */}
      <circle cx="22" cy="42" r="3" fill="#2D572C"/>
      <circle cx="22" cy="42" r="1.5" fill="#3D6B3C"/>
      {/* Cheese stretch */}
      <path d="M42 44 Q46 46 44 50" stroke="#FFE082" strokeWidth="2" fill="none" opacity="0.7"/>
    </svg>
  ),
  burgers: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Bottom bun */}
      <path d="M10 42 Q10 48 32 48 Q54 48 54 42 L54 40 L10 40 Z" fill="#D4892A"/>
      {/* Patty */}
      <rect x="8" y="32" width="48" height="8" rx="3" fill="#6D3B1A"/>
      {/* Cheese */}
      <path d="M8 32 L56 32 L58 35 Q48 38 32 36 Q16 38 6 35 Z" fill="#FFB800"/>
      {/* Lettuce */}
      <path d="M6 30 Q12 26 20 30 Q28 26 36 30 Q44 26 52 30 Q58 26 58 30 L58 33 L6 33 Z" fill="#4CAF50"/>
      {/* Tomato */}
      <rect x="12" y="27" width="40" height="5" rx="2" fill="#E53935" opacity="0.8"/>
      {/* Top bun */}
      <path d="M10 28 Q10 10 32 10 Q54 10 54 28 Z" fill="#E8A040"/>
      {/* Bun highlight */}
      <path d="M20 16 Q32 12 44 16" stroke="#F0C070" strokeWidth="2" fill="none" opacity="0.6"/>
      {/* Seeds */}
      <ellipse cx="24" cy="18" rx="1.5" ry="2.5" fill="#FFF3D0" transform="rotate(-20 24 18)"/>
      <ellipse cx="36" cy="16" rx="1.5" ry="2.5" fill="#FFF3D0" transform="rotate(15 36 16)"/>
      <ellipse cx="42" cy="22" rx="1.5" ry="2" fill="#FFF3D0" transform="rotate(-10 42 22)"/>
    </svg>
  ),
  fries: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Box */}
      <path d="M14 28 L50 28 L46 58 L18 58 Z" fill="#E53935"/>
      <path d="M14 28 L50 28 L48 34 L16 34 Z" fill="#C62828"/>
      {/* Box pattern */}
      <path d="M20 34 L22 58" stroke="#D32F2F" strokeWidth="1"/>
      <path d="M30 34 L31 58" stroke="#D32F2F" strokeWidth="1"/>
      <path d="M40 34 L39 58" stroke="#D32F2F" strokeWidth="1"/>
      {/* Fries */}
      <rect x="17" y="6" width="5" height="26" rx="2" fill="#FFD54F" transform="rotate(-8 19 20)"/>
      <rect x="24" y="4" width="5" height="28" rx="2" fill="#FFC107" transform="rotate(3 26 18)"/>
      <rect x="31" y="6" width="5" height="26" rx="2" fill="#FFD54F" transform="rotate(-3 33 19)"/>
      <rect x="37" y="5" width="5" height="27" rx="2" fill="#FFCA28" transform="rotate(6 39 18)"/>
      <rect x="43" y="8" width="5" height="24" rx="2" fill="#FFD54F" transform="rotate(12 45 20)"/>
      {/* Fry tips */}
      <rect x="20" y="3" width="4" height="4" rx="2" fill="#E8B800" transform="rotate(-8 22 5)"/>
      <rect x="33" y="4" width="4" height="4" rx="2" fill="#E8B800" transform="rotate(-3 35 6)"/>
    </svg>
  ),
  momos: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Steam */}
      <path d="M26 10 Q28 6 26 2" stroke="#B0BEC5" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M34 8 Q36 4 34 0" stroke="#B0BEC5" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
      {/* Plate */}
      <ellipse cx="32" cy="50" rx="26" ry="8" fill="#E0E0E0"/>
      <ellipse cx="32" cy="48" rx="24" ry="7" fill="#F5F5F5"/>
      {/* Momo 1 (center) */}
      <ellipse cx="32" cy="34" rx="14" ry="10" fill="#FFF3E0"/>
      <path d="M22 30 Q27 22 32 26 Q37 22 42 30" stroke="#E8C9A0" strokeWidth="1.5" fill="none"/>
      <path d="M24 32 Q28 28 32 30 Q36 28 40 32" stroke="#E8C9A0" strokeWidth="1" fill="none" opacity="0.6"/>
      {/* Momo crimp top */}
      <path d="M28 26 L30 24 L32 26 L34 24 L36 26" stroke="#D4A574" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Momo 2 (left) */}
      <ellipse cx="18" cy="42" rx="10" ry="7" fill="#FFF8E8"/>
      <path d="M12 40 Q15 36 18 38 Q21 36 24 40" stroke="#E8C9A0" strokeWidth="1" fill="none"/>
      {/* Momo 3 (right) */}
      <ellipse cx="46" cy="42" rx="10" ry="7" fill="#FFF8E8"/>
      <path d="M40 40 Q43 36 46 38 Q49 36 52 40" stroke="#E8C9A0" strokeWidth="1" fill="none"/>
      {/* Chutney dots */}
      <circle cx="32" cy="48" r="2" fill="#E53935" opacity="0.7"/>
      <circle cx="38" cy="50" r="1.5" fill="#4CAF50" opacity="0.7"/>
    </svg>
  ),
  new: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Star burst bg */}
      <circle cx="32" cy="32" r="24" fill="#FFF3E0"/>
      {/* Star */}
      <path d="M32 8 L37 24 L54 24 L40 34 L45 50 L32 40 L19 50 L24 34 L10 24 L27 24 Z" fill="#FF9800"/>
      <path d="M32 14 L35 24 L46 24 L38 31 L41 42 L32 35 L23 42 L26 31 L18 24 L29 24 Z" fill="#FFB74D"/>
      {/* NEW text */}
      <text x="32" y="36" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Arial">NEW</text>
    </svg>
  ),
  shakes: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Glass body */}
      <path d="M18 22 L22 56 L42 56 L46 22 Z" fill="#BBDEFB"/>
      <path d="M18 22 L22 56 L42 56 L46 22 Z" fill="url(#shake-fill)" opacity="0.9"/>
      {/* Glass shine */}
      <path d="M22 24 L24 52" stroke="#fff" strokeWidth="2" opacity="0.4"/>
      {/* Whipped cream */}
      <ellipse cx="32" cy="22" rx="16" ry="6" fill="#FFF9C4"/>
      <circle cx="26" cy="19" r="5" fill="#FFFDE7"/>
      <circle cx="36" cy="18" r="6" fill="#FFFDE7"/>
      <circle cx="32" cy="16" r="5" fill="#FFF"/>
      {/* Cherry */}
      <circle cx="34" cy="10" r="4" fill="#E53935"/>
      <circle cx="35" cy="9" r="1.5" fill="#EF5350" opacity="0.6"/>
      <path d="M34 6 Q36 2 40 4" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
      {/* Straw */}
      <rect x="38" y="4" width="3" height="36" rx="1.5" fill="#FF7043" transform="rotate(8 39 22)"/>
      <defs>
        <linearGradient id="shake-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E1BEE7"/>
          <stop offset="100%" stopColor="#CE93D8"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  drinks: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Can body */}
      <rect x="16" y="12" width="32" height="44" rx="4" fill="#E53935"/>
      {/* Can top */}
      <ellipse cx="32" cy="12" rx="16" ry="4" fill="#EF5350"/>
      <ellipse cx="32" cy="12" rx="14" ry="3" fill="#C62828"/>
      {/* Tab */}
      <ellipse cx="32" cy="10" rx="4" ry="2" fill="#BDBDBD" stroke="#999" strokeWidth="0.5"/>
      {/* Label stripe */}
      <rect x="16" y="24" width="32" height="18" fill="#B71C1C"/>
      {/* Wave design */}
      <path d="M16 28 Q24 24 32 28 Q40 32 48 28" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M16 34 Q24 30 32 34 Q40 38 48 34" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4"/>
      {/* Text area */}
      <rect x="22" y="30" width="20" height="8" rx="2" fill="#fff" opacity="0.15"/>
      {/* Drops */}
      <circle cx="42" cy="38" r="2" fill="#BBDEFB" opacity="0.6"/>
      <circle cx="20" cy="44" r="1.5" fill="#BBDEFB" opacity="0.5"/>
      {/* Can bottom */}
      <ellipse cx="32" cy="56" rx="16" ry="3" fill="#C62828"/>
    </svg>
  ),
  combos: (
    <svg width="28" height="28" viewBox="0 0 64 64">
      {/* Box */}
      <rect x="8" y="18" width="48" height="38" rx="4" fill="#FF7043"/>
      <rect x="8" y="18" width="48" height="38" rx="4" stroke="#E64A19" strokeWidth="1"/>
      {/* Box lid */}
      <path d="M6 20 Q6 14 32 14 Q58 14 58 20 L56 22 L8 22 Z" fill="#FF8A65"/>
      {/* Ribbon vertical */}
      <rect x="28" y="14" width="8" height="42" fill="#FFC107"/>
      {/* Ribbon horizontal */}
      <rect x="8" y="32" width="48" height="8" fill="#FFC107"/>
      {/* Bow left */}
      <ellipse cx="24" cy="14" rx="8" ry="5" fill="#FFD54F" transform="rotate(-20 24 14)"/>
      {/* Bow right */}
      <ellipse cx="40" cy="14" rx="8" ry="5" fill="#FFD54F" transform="rotate(20 40 14)"/>
      {/* Bow center */}
      <circle cx="32" cy="14" r="4" fill="#FFA000"/>
      {/* Star decorations */}
      <circle cx="18" cy="26" r="1.5" fill="#FFF9C4" opacity="0.7"/>
      <circle cx="46" cy="44" r="1.5" fill="#FFF9C4" opacity="0.7"/>
      <circle cx="16" cy="48" r="1" fill="#FFF9C4" opacity="0.5"/>
    </svg>
  ),
};

export function CategoryIcon({ id }: { id: string }) {
  return <>{icons[id] || icons.all}</>;
}

export default icons;
