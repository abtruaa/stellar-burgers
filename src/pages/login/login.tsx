import { FC, SyntheticEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { login } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.user);
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(values)).unwrap();
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <LoginUI
      errorText={error || undefined}
      email={values.email}
      password={values.password}
      setEmail={(value) =>
        handleChange({ target: { name: 'email', value } } as any)
      }
      setPassword={(value) =>
        handleChange({ target: { name: 'password', value } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
