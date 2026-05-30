import React, { useState, useEffect } from 'react';
import { Save, X, Sparkles } from 'lucide-react';

/**
 * Componente ProjectForm
 * Formulário reutilizável para criação e edição de projetos no painel do administrador.
 * 
 * @param {Object} props
 * @param {Object} props.project - Objeto do projeto atual (quando estiver editando)
 * @param {Function} props.onSubmit - Ação de envio do formulário contendo os dados do projeto
 * @param {Function} props.onCancel - Ação disparada ao cancelar/fechar o formulário
 * @param {boolean} props.isLoading - Controla o estado de envio/bloqueio de inputs
 */
function ProjectForm({ project, onSubmit, onCancel, isLoading }) {
  // Define os estados iniciais dos campos do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stackInput, setStackInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [order, setOrder] = useState(0);

  // Efeito para preencher os dados caso estejamos em modo de edição de projeto
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      // Transforma o array de stack ["React", "Firebase"] em string para exibição "React, Firebase"
      setStackInput(project.stack ? project.stack.join(', ') : '');
      setRepoUrl(project.repoUrl || '');
      setDeployUrl(project.deployUrl || '');
      setThumbnail(project.thumbnail || '');
      setOrder(project.order || 0);
    } else {
      // Limpa os campos se for um novo projeto
      setName('');
      setDescription('');
      setStackInput('');
      setRepoUrl('');
      setDeployUrl('');
      setThumbnail('');
      setOrder(0);
    }
  }, [project]);

  /**
   * Manipulador de submissão do formulário
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações básicas obrigatórias
    if (!name.trim() || !description.trim() || !repoUrl.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios (Nome, Descrição e Repositório).");
      return;
    }

    // Processamento da stack: divide por vírgula, limpa espaços e filtra strings vazias
    const stack = stackInput
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    // Monta o objeto com os dados tratados
    const projectData = {
      name: name.trim(),
      description: description.trim(),
      stack,
      repoUrl: repoUrl.trim(),
      deployUrl: deployUrl.trim() || '',
      thumbnail: thumbnail.trim() || '',
      order: Number(order) || 0,
      updatedAt: new Date()
    };

    // Adiciona o createdAt apenas se for um projeto totalmente novo
    if (!project) {
      projectData.createdAt = new Date();
    }

    // Dispara a função onSubmit herdada do pai
    onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className="project-form fade-in">
      <div className="form-header">
        <Sparkles size={20} className="header-icon" />
        <h3 className="form-title">
          {project ? 'Editar Detalhes do Projeto' : 'Cadastrar Novo Projeto'}
        </h3>
      </div>

      {/* Campo: Nome do Projeto (Obrigatório) */}
      <div className="form-group">
        <label className="form-label" htmlFor="proj-name">Nome do Projeto *</label>
        <input
          id="proj-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: E-commerce Moderno"
          className="form-input"
          required
          disabled={isLoading}
        />
      </div>

      {/* Campo: Descrição Curta (Obrigatório) */}
      <div className="form-group">
        <label className="form-label" htmlFor="proj-desc">Descrição do Projeto *</label>
        <textarea
          id="proj-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Forneça um resumo detalhado dos recursos do projeto e stacks utilizadas..."
          className="form-textarea"
          required
          disabled={isLoading}
        />
      </div>

      {/* Campo: Tecnologias / Stack (Tags separadas por vírgula) */}
      <div className="form-group">
        <label className="form-label" htmlFor="proj-stack">Tecnologias / Stack (Separadas por vírgula)</label>
        <input
          id="proj-stack"
          type="text"
          value={stackInput}
          onChange={(e) => setStackInput(e.target.value)}
          placeholder="Ex: React, Firebase, CSS Grid, HTML5"
          className="form-input"
          disabled={isLoading}
        />
        <span className="field-hint">As tags serão geradas automaticamente na exibição pública.</span>
      </div>

      <div className="form-row">
        {/* Campo: Link do Repositório (Obrigatório) */}
        <div className="form-group flex-1">
          <label className="form-label" htmlFor="proj-repo">URL do Repositório (GitHub) *</label>
          <input
            id="proj-repo"
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/usuario/repositorio"
            className="form-input"
            required
            disabled={isLoading}
          />
        </div>

        {/* Campo: Link de Deploy / Live Demo (Opcional) */}
        <div className="form-group flex-1">
          <label className="form-label" htmlFor="proj-deploy">URL de Deploy (Opcional)</label>
          <input
            id="proj-deploy"
            type="url"
            value={deployUrl}
            onChange={(e) => setDeployUrl(e.target.value)}
            placeholder="https://meuprojeto.web.app"
            className="form-input"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-row">
        {/* Campo: Thumbnail Externa (Opcional) */}
        <div className="form-group flex-2">
          <label className="form-label" htmlFor="proj-thumb">URL da Imagem / Thumbnail (Opcional)</label>
          <input
            id="proj-thumb"
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="form-input"
            disabled={isLoading}
          />
          <span className="field-hint">Insira uma URL pública da imagem (Unsplash, Imgur, GitHub, etc).</span>
        </div>

        {/* Campo: Ordem (Opcional - numérico) */}
        <div className="form-group flex-1">
          <label className="form-label" htmlFor="proj-order">Ordem de Exibição</label>
          <input
            id="proj-order"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="form-input"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Botões de Ação do Formulário */}
      <div className="form-buttons">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          <X size={18} />
          <span>Cancelar</span>
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner" style={{ width: '18px', height: '18px' }} />
          ) : (
            <Save size={18} />
          )}
          <span>{project ? 'Atualizar Projeto' : 'Salvar Projeto'}</span>
        </button>
      </div>

      <style>{`
        .project-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 12px;
        }

        .header-icon {
          color: var(--accent-primary);
        }

        .form-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .form-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .flex-1 {
          flex: 1;
          min-width: 250px;
        }

        .flex-2 {
          flex: 2;
          min-width: 280px;
        }

        .field-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
          border-top: 1px solid var(--glass-border);
          padding-top: 18px;
        }
      `}</style>
    </form>
  );
}

export default ProjectForm;
