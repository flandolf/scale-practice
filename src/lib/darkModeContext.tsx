import { createContext, useContext, useState } from "react";

interface DarkmodeContextValue {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const darkModeContext = createContext<DarkmodeContextValue | undefined>(
  undefined
);

export const useDarkMode = () => {
  const context = useContext(darkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

export const DarkModeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <darkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </darkModeContext.Provider>
  );
};
