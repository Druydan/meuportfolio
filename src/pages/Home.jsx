import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProjectCard from '../components/ProjectCard';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Code,
  Briefcase
} from 'lucide-react';

/**
 * Página Home
 * Landing Page pública do portfólio, projetada com interface premium e UX fluida.
 */
function Home() {
  const navigate = useNavigate();
  
  // Estados para armazenamento dos projetos e filtros
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para a tag selecionada no filtro de tecnologias
  const [selectedTag, setSelectedTag] = useState('Todos');
  
  // Lista única de tags extraídas dinamicamente de todos os projetos cadastrados
  const [allTags, setAllTags] = useState([]);

  // Efeito para carregar os projetos diretamente do Cloud Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        // Cria uma consulta no Firestore ordenando por ordem (ascendente) e depois por criação
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        const projectsList = [];
        const tagsSet = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const proj = { id: doc.id, ...data };
          projectsList.push(proj);
          
          // Extrai tags dinamicamente para o filtro
          if (data.stack && Array.isArray(data.stack)) {
            data.stack.forEach(tag => {
              if (tag.trim()) tagsSet.add(tag.trim());
            });
          }
        });

        setProjects(projectsList);
        setFilteredProjects(projectsList);
        setAllTags(Array.from(tagsSet));
      } catch (err) {
        console.error("Erro ao carregar projetos do Firestore:", err);
        setError("Não foi possível carregar os projetos. Por favor, recarregue a página.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Efeito para aplicar o filtro de tag quando selectedTag ou projects mudarem
  useEffect(() => {
    if (selectedTag === 'Todos') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(proj => 
        proj.stack && proj.stack.some(tag => tag.trim() === selectedTag)
      );
      setFilteredProjects(filtered);
    }
  }, [selectedTag, projects]);

  return (
    <div className="home-container">
      {/* Barra de Navegação Superior (Header) */}
      <header className="home-header glass-panel">
        <div className="header-brand">
          <Sparkles className="brand-icon" size={22} />
          <span className="brand-name">Dev<span className="text-gradient">Portfolio</span></span>
        </div>
        <nav className="header-nav">
          <a href="#about" className="nav-link">Sobre</a>
          <a href="#projects" className="nav-link">Projetos</a>
          <a href="#contact" className="nav-link">Contato</a>
        </nav>
      </header>

      {/* Seção Hero: Apresentação Pessoal de Destaque */}
      <section id="about" className="hero-section container">
        <div className="hero-content">
          <div className="hero-badge fade-in">
            <Code size={14} />
            <span>Engenheiro Full-Stack Sênior</span>
          </div>
          
          <h1 className="hero-title fade-in">
            Criando experiências digitais <br />
            <span className="text-gradient">modernas, fluidas e seguras</span>
          </h1>
          
          <p className="hero-bio fade-in">
            Especializado no desenvolvimento de aplicações de alta performance utilizando 
            o ecossistema React, Node.js e Firebase. Focado em arquiteturas serverless do plano 
            Spark, garantindo escalabilidade com zero custos de infraestrutura operacional.
          </p>
          
          <div className="hero-cta fade-in">
            <a href="#projects" className="btn btn-primary">
              <span>Ver Projetos</span>
              <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn btn-secondary">
              <span>Entre em contato</span>
            </a>
          </div>
        </div>

        {/* Avatar Circular Tridimensional Gerado por IA */}
        <div className="hero-avatar-container fade-in">
          <div className="avatar-wrapper">
            <img 
              src="/avatar.png" 
              alt="Avatar do Desenvolvedor" 
              className="developer-avatar" 
            />
          </div>
        </div>
      </section>

      {/* Seção Projetos: Filtros e Listagem */}
      <section id="projects" className="projects-section container">
        <div className="section-header">
          <Briefcase size={20} className="section-icon" />
          <h2 className="section-title">Trabalhos em Destaque</h2>
          <p className="section-subtitle">Conheça algumas das minhas criações recentes armazenadas no Firestore</p>
        </div>

        {/* Filtros de Tecnologia Dinâmicos */}
        {!loading && projects.length > 0 && (
          <div className="filter-container fade-in">
            <button 
              className={`filter-tag ${selectedTag === 'Todos' ? 'active' : ''}`}
              onClick={() => setSelectedTag('Todos')}
            >
              Todos ({projects.length})
            </button>
            {allTags.map((tag, idx) => (
              <button
                key={idx}
                className={`filter-tag ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Feedback de Carregamento dos Dados */}
        {loading ? (
          <div className="loading-state flex-center">
            <div className="spinner spinner-large" />
            <p>Carregando projetos de alta tecnologia...</p>
          </div>
        ) : error ? (
          <div className="error-state glass-panel flex-center">
            <p className="error-message">{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state glass-panel flex-center">
            <p className="empty-message">Nenhum projeto encontrado para o filtro "{selectedTag}".</p>
          </div>
        ) : (
          /* Grid de Cards dos Projetos */
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Seção Contato / Footer */}
      <footer id="contact" className="home-footer">
        <div className="footer-content container">
          <div className="footer-brand">
            <span className="brand-name">Dev<span className="text-gradient">Portfolio</span></span>
            <p className="footer-tagline">Construindo o amanhã com código inteligente e limpo.</p>
          </div>

          {/* Links Sociais */}
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="mailto:seu-email@gmail.com" className="social-link" title="E-mail">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Rodapé de Copyright e Cadeado Admin */}
        <div className="footer-bottom container">
          <p className="copyright-text">&copy; {new Date().getFullYear()} - Portfólio Profissional. Hospedado gratuitamente no Firebase Spark.</p>
          
          {/* Ícone de Cadeado Discreto para Entrada do Admin */}
          <button 
            onClick={() => navigate('/admin')} 
            className="btn-admin-portal"
            title="Acessar Portal Administrativo"
          >
            <Lock size={14} />
          </button>
        </div>
      </footer>

      {/* Folha de estilos acoplada para a landing page pública */}
      <style>{`
        .home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 60px;
        }

        /* Header Style */
        .home-header {
          position: sticky;
          top: 20px;
          margin: 20px auto 0;
          width: 90%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 40px !important;
          z-index: 100;
          border-radius: var(--radius-full) !important;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-icon {
          color: var(--accent-primary);
        }

        .brand-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.03em;
        }

        .header-nav {
          display: flex;
          gap: 30px;
        }

        .nav-link {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        /* Hero Section */
        .hero-section {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
          padding-top: 40px;
          padding-bottom: 40px;
          min-height: 70vh;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          color: var(--accent-primary);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }

        .hero-bio {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.6;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        /* Avatar com Efeito 3D Neon */
        .hero-avatar-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .avatar-wrapper {
          position: relative;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          padding: 8px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          box-shadow: 0 0 40px -10px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.6);
          animation: pulseGlow 6s ease-in-out infinite alternate;
        }

        .developer-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--bg-primary);
          background-color: var(--bg-secondary);
        }

        /* Projects Section */
        .projects-section {
          padding-top: 60px;
          padding-bottom: 60px;
        }

        .section-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        .section-icon {
          color: var(--accent-primary);
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 700;
        }

        .section-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          max-width: 600px;
        }

        /* Filtros */
        .filter-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .filter-tag {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-tag:hover {
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .filter-tag.active {
          background: var(--accent-gradient);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        /* Grid de Projetos */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        .loading-state, .error-state, .empty-state {
          flex-direction: column;
          gap: 16px;
          min-height: 250px;
          text-align: center;
          color: var(--text-secondary);
          border-radius: var(--radius-lg);
        }

        .error-message {
          color: #ef4444;
          font-weight: 500;
        }

        /* Footer */
        .home-footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--glass-border);
          padding: 60px 0 20px;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-tagline {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .footer-socials {
          display: flex;
          gap: 16px;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .social-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-3px);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .copyright-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .btn-admin-portal {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all var(--transition-fast);
        }

        .btn-admin-portal:hover {
          color: var(--accent-primary);
          background: rgba(139, 92, 246, 0.08);
        }

        /* Animações e Responsividade */
        @keyframes pulseGlow {
          from { box-shadow: 0 0 30px -10px rgba(139, 92, 246, 0.3); }
          to { box-shadow: 0 0 50px -5px rgba(139, 92, 246, 0.5), 0 0 20px rgba(6, 182, 212, 0.2); }
        }

        @media (max-width: 968px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .hero-content {
            align-items: center;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .avatar-wrapper {
            width: 260px;
            height: 260px;
          }
        }

        @media (max-width: 576px) {
          .home-header {
            padding: 15px 20px !important;
          }

          .header-nav {
            display: none; /* Simplifica o menu mobile */
          }

          .hero-title {
            font-size: 2.2rem;
          }

          .hero-cta {
            flex-direction: column;
            width: 100%;
          }

          .hero-cta .btn {
            width: 100%;
          }

          .footer-content, .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
