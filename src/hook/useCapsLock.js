import { useState, useEffect } from 'react';

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