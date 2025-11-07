import { createContext, useContext, useState } from 'react';

const CadastroModalContext = createContext();

export function CadastroModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <CadastroModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </CadastroModalContext.Provider>
  );
}

export function useCadastroModal() {
  const context = useContext(CadastroModalContext);
  if (!context) {
    throw new Error('useCadastroModal must be used within CadastroModalProvider');
  }
  return context;
}

