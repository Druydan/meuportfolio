import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Renderiza a aplicação React no elemento HTML correspondente à div com id 'root'
// O StrictMode ajuda a identificar problemas potenciais durante a fase de desenvolvimento
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
