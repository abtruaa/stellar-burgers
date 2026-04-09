import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/app/app';
import store from './services/store';
import './index.css';
import { fetchUser } from './services/slices/userSlice';

const token = localStorage.getItem('accessToken');
if (token) {
  store.dispatch(fetchUser());
} else {
  localStorage.removeItem('refreshToken');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
