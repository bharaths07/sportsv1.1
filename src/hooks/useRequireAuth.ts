import { useNavigate } from 'react-router-dom';
import { User } from '../domain/user';

export const useRequireAuth = () => {
  const navigate = useNavigate();

  const requireAuth = (user: User | null) => {
    if (!user) {
      navigate('/login');
      return false;
    }
    return true;
  };

  return requireAuth;
};
