import { useNavigate } from 'react-router-dom';
import '../styles/logout.css';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile_complete');
    navigate('/login');
  };

  return (
    <button 
      className="logout-button"
      onClick={handleLogout}
    >
      Sair
    </button>
  );
}

export default Logout;