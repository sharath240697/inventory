import { createContext, useContext, useState } from 'react';
import { Item_t } from '../../types';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: Item_t[];
  setFilteredItems: React.Dispatch<React.SetStateAction<Item_t[]>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item_t[]>([]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, filteredItems, setFilteredItems }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
