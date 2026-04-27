import type { ReactNode } from 'react';

interface CategoryChipProps {
  icon?: ReactNode;
  name: string;
  active: boolean;
  onClick: () => void;
}

export default function CategoryChip({ icon, name, active, onClick }: CategoryChipProps) {
  return (
    <button
      className={`category-chip${active ? ' active' : ''}`}
      onClick={onClick}
      id={`category-${name.toLowerCase().replace(/\s/g, '-')}`}
    >
      <span className="category-chip-icon">{icon}</span>
      <span>{name}</span>
    </button>
  );
}
