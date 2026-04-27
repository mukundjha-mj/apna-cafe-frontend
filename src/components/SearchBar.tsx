import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  showFilter?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Would you like to eat something?',
  onFilterClick,
  showFilter = false,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <div className="search-bar" id="search-bar">
      <Search size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {showFilter && (
        <button
          className="btn-ghost"
          onClick={onFilterClick}
          style={{ padding: '0.25rem' }}
          aria-label="Filters"
        >
          <SlidersHorizontal size={18} />
        </button>
      )}
    </div>
  );
}
