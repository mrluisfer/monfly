import React, { ReactNode, useEffect, useState } from "react";

export const TransactionHoverContext = React.createContext({
  disableHover: false,
  setDisableHover: (_value: boolean) => {},
});

export const TransactionHoverProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [disableHover, setDisableHover] = useState(false);

  // Local Storage to persist the hover state
  useEffect(() => {
    const storedValue = localStorage.getItem("disable-hover");
    if (storedValue !== null) {
      setDisableHover(storedValue === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("disable-hover", String(disableHover));
  }, [disableHover]);

  return (
    <TransactionHoverContext.Provider value={{ disableHover, setDisableHover }}>
      {children}
    </TransactionHoverContext.Provider>
  );
};
