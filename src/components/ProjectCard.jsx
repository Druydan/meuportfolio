import React from 'react';
import { Github, ExternalLink, Edit, Trash2 } from 'lucide-react';

/**
 * Componente ProjectCard
 * Renderiza um projeto individual com visual moderno (Glassmorphism), tags de tecnologias e links interativos.
 * 
 * @param {Object} props
 * @param {Object} props.project - Objeto contendo os dados do projeto
 * @param {boolean} props.isAdminView - Flag que indica se o card está sendo renderizado no Painel Admin
 * @param {Function} props.onEdit - Callback disparado ao clicar no botão de editar
 * @param {Function} props.onDelete - Callback disparado ao clicar no botão de excluir
 */
function ProjectCard({ project, isAdminView = false, onEdit, onDelete }) {
  const { name, description, stack = [], repoUrl, deployUrl, thumbnail } = project;

  return (
    <article className="project-card glass-panel fade-in">
      {/* Container da Thumbnail do Projeto */}
      <div className="card-thumbnail-container">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={`Capa do projeto ${name}`} 
            className="card-thumbnail"
            loading="lazy"
          />
        ) : (
          /* Placeholder de luxo com gradiente espacial caso não exista imagem cadastrada */
          <div className="card-thumbnail-placeholder">
            <span className="placeholder-icon">🚀</span>
          </div>
        )}
      </div>

      {/* Conteúdo de Texto e Tags */}
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <p className="card-description">{description}</p>
        
        {/* Tecnologias Utilizadas (Tags) */}
        {stack.length > 0 && (
          <div className="card-tags">
            {stack.map((tech, idx) => (
              <span key={idx} className="card-tag">
                {tech.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Links Externos / Ações */}
        <div className="card-actions">
          <div className="external-links">
            {repoUrl && (
              <a 
                href={repoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="action-link"
                title="Acessar Repositório no GitHub"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            )}
            
            {deployUrl && (
              <a 
                href={deployUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="action-link deploy-btn"
                title="Visualizar aplicação em produção"
              >
                <ExternalLink size={18} />
                <span>Demo</span>
              </a>
            )}
          </div>

          {/* Botões de Ações do Administrador (Apenas no Painel Admin) */}
          {isAdminView && (
            <div className="admin-actions">
              <button 
                onClick={() => onEdit(project)} 
                className="btn-icon btn-edit"
                title="Editar Projeto"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete(project.id)} 
                className="btn-icon btn-delete"
                title="Excluir Projeto"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS específicos do Componente encadeados de forma limpa */}
      <style>{`
        .project-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          padding: 0 !important; /* Sobrescreve o padding do glass-panel */
          border-radius: var(--radius-md) !important;
          transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
        }

        .project-card:hover {
          transform: translateY(-8px);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(139, 92, 246, 0.2);
        }

        .card-thumbnail-container {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid var(--glass-border);
        }

        .card-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .project-card:hover .card-thumbnail {
          transform: scale(1.05);
        }

        .card-thumbnail-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .card-thumbnail-placeholder::after {
          content: '';
          position: absolute;
          width: 60px;
          height: 60px;
          background: var(--accent-gradient);
          filter: blur(25px);
          opacity: 0.4;
          z-index: 1;
        }

        .placeholder-icon {
          font-size: 2.5rem;
          z-index: 2;
          animation: float 3s ease-in-out infinite;
        }

        .card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: var(--text-primary);
          font-weight: 600;
        }

        .card-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .card-tag {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-secondary);
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.15);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          letter-spacing: 0.03em;
        }

        .card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 15px;
          margin-top: auto;
        }

        .external-links {
          display: flex;
          gap: 16px;
        }

        .action-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .action-link:hover {
          color: var(--accent-primary);
        }

        .action-link.deploy-btn:hover {
          color: var(--accent-secondary);
        }

        .admin-actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-edit:hover {
          color: var(--accent-primary);
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.2);
        }

        .btn-delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </article>
  );
}

export default ProjectCard;
