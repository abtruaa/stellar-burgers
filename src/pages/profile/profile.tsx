import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser, fetchUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.user);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Загружаем пользователя при монтировании
  useEffect(() => {
    if (!user && !isUserLoaded) {
      setIsUserLoaded(true);
      dispatch(fetchUser());
    }
  }, [dispatch, user, isUserLoaded]);

  // Обновляем форму только когда user загружен и изменился
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // Проверяем, изменились ли данные (сравниваем с исходными данными пользователя)
  const isFormChanged =
    (user && formValue.name !== user.name) ||
    (user && formValue.email !== user.email) ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const updatedData: { name?: string; email?: string; password?: string } =
      {};
    if (formValue.name !== user?.name) updatedData.name = formValue.name;
    if (formValue.email !== user?.email) updatedData.email = formValue.email;
    if (formValue.password) updatedData.password = formValue.password;

    if (Object.keys(updatedData).length > 0) {
      await dispatch(updateUser(updatedData));
      setFormValue({ ...formValue, password: '' });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || undefined}
    />
  );
};
