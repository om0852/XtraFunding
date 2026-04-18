"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FundingDeal {
  id: string;
  name: string;
  logo?: string;
  sector?: string;
}

interface ComparisonContextType {
  selectedDeals: FundingDeal[];
  addDeal: (deal: FundingDeal) => void;
  removeDeal: (id: string) => void;
  clearSelection: () => void;
  isComparisonOpen: boolean;
  setComparisonOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedDeals, setSelectedDeals] = useState<FundingDeal[]>([]);
  const [isComparisonOpen, setComparisonOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedDeals');
    if (saved) {
      try {
        setSelectedDeals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved deals", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('selectedDeals', JSON.stringify(selectedDeals));
  }, [selectedDeals]);

  const addDeal = (deal: FundingDeal) => {
    setSelectedDeals((prev) => {
      if (prev.find(s => s.id === deal.id)) return prev;
      if (prev.length >= 4) return prev; // Limit to 4 for UI clarity
      return [...prev, deal];
    });
  };

  const removeDeal = (id: string) => {
    setSelectedDeals((prev) => prev.filter(s => s.id !== id));
  };

  const clearSelection = () => {
    setSelectedDeals([]);
  };

  return (
    <ComparisonContext.Provider value={{ 
      selectedDeals, 
      addDeal, 
      removeDeal, 
      clearSelection,
      isComparisonOpen,
      setComparisonOpen
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
