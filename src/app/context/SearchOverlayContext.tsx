import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { SearchModal } from '../components/SearchModal';

type SearchOverlayContextValue = {
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  isSearchOpen: boolean;
};

const SearchOverlayContext = createContext<SearchOverlayContextValue | null>(null);

export function SearchOverlayProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const openSearch = useCallback((q = '') => {
    setInitialQuery(q);
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setInitialQuery('');
  }, []);

  const value = useMemo(
    () => ({ openSearch, closeSearch, isSearchOpen: isOpen }),
    [openSearch, closeSearch, isOpen]
  );

  return (
    <SearchOverlayContext.Provider value={value}>
      {children}
      <SearchModal isOpen={isOpen} onClose={closeSearch} initialQuery={initialQuery} />
    </SearchOverlayContext.Provider>
  );
}

export function useSearchOverlay(): SearchOverlayContextValue {
  const ctx = useContext(SearchOverlayContext);
  if (!ctx) {
    throw new Error('useSearchOverlay must be used within SearchOverlayProvider');
  }
  return ctx;
}
