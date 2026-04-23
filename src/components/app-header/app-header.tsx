// src/components/app-header/app-header.tsx
import { FC, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const headerRef = useRef<HTMLDivElement>(null);

  const getUserName = () => {
    if (user?.name) return user.name;
    return 'Личный кабинет';
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent?.toLowerCase() || '';

      // Ищем родительский элемент с нужным текстом
      let currentElement: HTMLElement | null = target;
      while (currentElement && currentElement !== headerRef.current) {
        const currentText = currentElement.textContent?.toLowerCase() || '';

        if (currentText.includes('конструктор')) {
          navigate('/');
          return;
        } else if (currentText.includes('лента заказов')) {
          navigate('/feed');
          return;
        } else if (
          currentText.includes('личный кабинет') ||
          (user?.name && currentText.includes(user.name.toLowerCase()))
        ) {
          navigate('/profile');
          return;
        }

        currentElement = currentElement.parentElement;
      }
    };

    const element = headerRef.current;
    if (element) {
      element.addEventListener('click', handleClick);
    }

    return () => {
      if (element) {
        element.removeEventListener('click', handleClick);
      }
    };
  }, [navigate, user]);

  return (
    <div ref={headerRef}>
      <AppHeaderUI userName={getUserName()} />
    </div>
  );
};
