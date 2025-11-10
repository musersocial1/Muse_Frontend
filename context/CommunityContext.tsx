// contexts/CommunityContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Community {
  id: string;
  name: string;
  image: any;
}

interface CommunityContextValue {
  selectedCommunity: Community | null;
  setSelectedCommunity: (community: Community | null) => void;
}

const CommunityContext = createContext<CommunityContextValue | undefined>(
  undefined
);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );

  return (
    <CommunityContext.Provider
      value={{ selectedCommunity, setSelectedCommunity }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) {
    throw new Error("useCommunity must be used inside CommunityProvider");
  }
  return ctx;
};
