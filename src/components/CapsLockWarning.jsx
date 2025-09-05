import { useState, useEffect } from 'react';
import '../styles/CapsLockWarning.css';

/**
 * Componente que detecta se o Caps Lock está ativado e exibe um aviso
 * @param {boolean} show - Controla se o aviso deve ser exibido
 * @param {string} className - Classe CSS adicional para estilização
 */
function CapsLockWarning({ show, className = '' }) {
  if (!show) return null;

  return (
    <div className={`caps-lock-warning ${className}`}>
      <span className="warning-icon">⚠️</span>
      <span className="warning-text">Caps Lock está ativado</span>
    </div>
  );
}

/**
 * Hook personalizado para detectar o estado do Caps Lock
 * @returns {boolean} - true se Caps Lock estiver ativado
 */
export function useCapsLock() {
  const [capsLockOn, setCapsLockOn] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Detecta se Caps Lock está ativado baseado na tecla pressionada
      const isCapsLockOn = event.getModifierState && event.getModifierState('CapsLock');
      setCapsLockOn(isCapsLockOn);
    };

    const handleKeyDown = (event) => {
      // Detecta quando a tecla Caps Lock é pressionada
      if (event.key === 'CapsLock') {
        setCapsLockOn(event.getModifierState('CapsLock'));
      }
    };

    // Adiciona os event listeners
    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup dos event listeners
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return capsLockOn;
}

export default CapsLockWarning;
