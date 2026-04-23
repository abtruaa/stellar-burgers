import { FC, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { register } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.user);
  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(values)).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <RegisterUI
      errorText={error || undefined}
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={(value) =>
        handleChange({ target: { name: 'email', value } } as any)
      }
      setPassword={(value) =>
        handleChange({ target: { name: 'password', value } } as any)
      }
      setUserName={(value) =>
        handleChange({ target: { name: 'name', value } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
