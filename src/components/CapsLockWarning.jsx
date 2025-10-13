// Importações ajustadas: removemos useState e useEffect, pois eles foram para o hook
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

// O componente agora é o ÚNICO export do arquivo
export default CapsLockWarning;

// OBS: O hook `useCapsLock` foi removido daqui e movido para 'hook/useCapsLock.js'.