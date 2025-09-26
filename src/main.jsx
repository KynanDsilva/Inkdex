import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';

AOS.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
