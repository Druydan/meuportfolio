import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';

/**
 * Componente principal da aplicação (App)
 * Configura o roteamento de toda a aplicação usando o react-router-dom
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública: Página inicial do Portfólio (acessível por qualquer visitante) */}
        <Route path="/" element={<Home />} />
        
        {/* Rota administrativa protegida: Controla a exibição do formulário CRUD e controle de projetos */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Rota de fallback para erros 404 (páginas não encontradas) - Redireciona para a Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
