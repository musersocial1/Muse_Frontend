// context/SwitcherContext.ts
import { createContext, useContext } from "react";

type SwitcherContextType = {
  openSwitcher: () => void;
  closeSwitcher: () => void;
};

export const SwitcherContext = createContext<SwitcherContextType | null>(null);

export const useSwitcher = () => {
  const ctx = useContext(SwitcherContext);
  if (!ctx) throw new Error("useSwitcher must be used inside ShrinkAnimation");
  return ctx;
};
