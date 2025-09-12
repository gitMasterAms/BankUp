import { useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/SidebarLayout.css';

function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className={`layout-container ${isOpen ? 'sidebar-open' : ''}`}>
      <button
        className="hamburger-button"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Overlay para fechar no mobile */}
      <div
        className={`backdrop ${isOpen ? 'show' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!isOpen}
      />

      <aside className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
        <Sidebar />
      </aside>

      <main className="content-area" onClick={closeSidebar}>
        {children}
      </main>
    </div>
  );
}

export default SidebarLayout;


