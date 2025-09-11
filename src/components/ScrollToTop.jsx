import { useState, useEffect } from 'react';
import '../styles/ScrollToTop.css';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Função para mostrar/esconder o botão baseado no scroll
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Função para voltar ao topo com scroll suave
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Adiciona o listener de scroll quando o componente é montado
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    // Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l8 8h-6v12h-4V10H4l8-8z"/>
          </svg>
        </button>
      )}
    </>
  );
}

export default ScrollToTop;
