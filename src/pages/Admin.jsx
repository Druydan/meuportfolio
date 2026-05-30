import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import ProjectForm from '../components/ProjectForm';
import { 
  Plus, 
  LogOut, 
  ArrowLeft, 
  ShieldAlert, 
  Copy, 
  Check, 
  Chrome, 
  FileCode,
  Sparkles,
  Edit2,
  Trash2,
  ExternalLink,
  Lock
} from 'lucide-react';

/**
 * Página Admin
 * Painel administrativo protegido, contendo autenticação via Google OAuth2.0
 * e o painel de controle CRUD dos projetos.
 */
function Admin() {
  const navigate = useNavigate();
  
  // Utiliza o hook personalizado de autenticação com validação de UID
  const { 
    user, 
    isAdmin, 
    loading: authLoading, 
    authError, 
    failedUid,
    loginWithGoogle, 
    logout,
    allowedUid
  } = useAuth();

  // Estados locais para controle do painel
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Escuta os projetos em tempo real do Firestore quando o usuário for Administrador
  useEffect(() => {
    if (!isAdmin) return;

    // Consulta os projetos ordenados por ordem crescente
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
    
    // Conexão por socket em tempo real (onSnapshot) com o Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsList = [];
      snapshot.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsList);
    }, (err) => {
      console.error("Erro ao escutar projetos em tempo real:", err);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  /**
   * Manipulador para salvar ou atualizar projetos no Firestore
   * 
   * @param {Object} projectData - Dados tratados do formulário
   */
  const handleFormSubmit = async (projectData) => {
    setSaving(true);
    try {
      if (editingProject) {
        // MODO EDICAO: Atualiza o documento existente no Firestore
        const docRef = doc(db, 'projects', editingProject.id);
        await updateDoc(docRef, projectData);
        alert("Projeto atualizado com sucesso!");
      } else {
        // MODO CADASTRAR: Adiciona um novo documento na coleção do Firestore
        await addDoc(collection(db, 'projects'), projectData);
        alert("Projeto cadastrado com sucesso!");
      }
      
      // Fecha o formulário e limpa o estado de edição
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      alert(`Falha ao salvar: ${err.message}. Verifique as Firestore Security Rules.`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Dispara a edição de um projeto
   * 
   * @param {Object} project - Projeto a ser editado
   */
  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
    // Rola a página suavemente até o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Dispara a exclusão de um projeto após confirmação amigável
   * 
   * @param {string} projectId - ID do projeto a ser deletado
   */
  const handleDeleteClick = async (projectId) => {
    if (window.confirm("Você tem certeza absoluta que deseja excluir este projeto? Esta ação é irreversível.")) {
      try {
        const docRef = doc(db, 'projects', projectId);
        await deleteDoc(docRef);
        alert("Projeto removido com sucesso!");
      } catch (err) {
        console.error("Erro ao deletar projeto:", err);
        alert(`Falha ao excluir: ${err.message}. Verifique as Firestore Security Rules.`);
      }
    }
  };

  /**
   * Copia o UID exibido na tela de erro de acesso negado para o clipboard
   * 
   * @param {string} uid - UID a ser copiado
   */
  const handleCopyUid = (uid) => {
    navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. TELA DE CARREGAMENTO INICIAL DO ESTADO DE AUTENTICAÇÃO
  if (authLoading) {
    return (
      <div className="admin-container flex-center">
        <div className="spinner spinner-large" />
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Validando credenciais administrativas...</p>
      </div>
    );
  }

  // 2. TELA DE ACESSO NEGADO / UID NÃO AUTORIZADO
  if (authError) {
    // Usa diretamente o failedUid retornado pelo hook, sem depender de Regex
    const userUid = failedUid || '';

    return (
      <div className="admin-container flex-center">
        <div className="glass-panel error-panel fade-in">
          <ShieldAlert size={48} className="error-icon" />
          <h2 className="error-title">Acesso Negado</h2>
          <p className="error-desc">
            Sua conta Google foi autenticada com sucesso, mas ela não tem permissão 
            de escrita para acessar o painel administrativo.
          </p>

          <div className="uid-box">
            <span className="uid-label">Seu UID do Google Auth:</span>
            <div className="uid-input-group">
              <input type="text" readOnly value={userUid} className="uid-input" />
              <button onClick={() => handleCopyUid(userUid)} className="btn-copy" title="Copiar UID">
                {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="setup-instructions">
            <h4>Como resolver isso?</h4>
            <ol>
              <li>Copie seu UID acima.</li>
              <li>Abra o arquivo <code>.env</code> na raiz do projeto e defina a variável: <br />
                  <code>VITE_ALLOWED_UID={userUid}</code>
              </li>
              <li>Atualize a regra no arquivo <code>firestore.rules</code> substituindo <code>"SEU_ALLOWED_UID_AQUI"</code> pelo seu UID.</li>
              <li>Reinicie o servidor local ou faça o deploy novamente das regras e da hospedagem!</li>
            </ol>
          </div>

          <div className="error-actions">
            <button onClick={logout} className="btn btn-primary">
              <LogOut size={18} />
              <span>Sair & Tentar Outro E-mail</span>
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              <ArrowLeft size={18} />
              <span>Voltar ao Portfólio</span>
            </button>
          </div>
        </div>

        <style>{`
          .error-panel {
            max-width: 580px;
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            border-color: rgba(239, 68, 68, 0.2) !important;
          }

          .error-icon {
            color: #ef4444;
            animation: pulse 2s infinite;
          }

          .error-title {
            font-size: 1.8rem;
            font-weight: 700;
          }

          .error-desc {
            color: var(--text-secondary);
            font-size: 0.95rem;
          }

          .uid-box {
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: var(--radius-md);
            border: 1px solid var(--glass-border);
            text-align: left;
          }

          .uid-label {
            font-family: var(--font-display);
            font-size: 0.8rem;
            color: var(--text-secondary);
            font-weight: 600;
            display: block;
            margin-bottom: 6px;
          }

          .uid-input-group {
            display: flex;
            gap: 10px;
          }

          .uid-input {
            flex-grow: 1;
            background: rgba(10, 15, 29, 0.6);
            border: 1px solid var(--glass-border);
            color: var(--accent-secondary);
            font-family: monospace;
            padding: 8px 12px;
            border-radius: 6px;
            outline: none;
            font-size: 0.85rem;
          }

          .btn-copy {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            cursor: pointer;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all var(--transition-fast);
          }

          .btn-copy:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .text-success {
            color: #10b981;
          }

          .setup-instructions {
            text-align: left;
            width: 100%;
            background: rgba(139, 92, 246, 0.03);
            border: 1px solid rgba(139, 92, 246, 0.1);
            padding: 20px;
            border-radius: var(--radius-md);
          }

          .setup-instructions h4 {
            color: var(--accent-primary);
            margin-bottom: 10px;
            font-size: 0.95rem;
          }

          .setup-instructions ol {
            padding-left: 20px;
            font-size: 0.85rem;
            color: var(--text-secondary);
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .setup-instructions code {
            font-family: monospace;
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 4px;
            color: var(--accent-secondary);
          }

          .error-actions {
            display: flex;
            gap: 12px;
            width: 100%;
            margin-top: 10px;
          }

          .error-actions .btn {
            flex: 1;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  // 3. TELA DE LOGIN (Caso não esteja logado)
  if (!user || !isAdmin) {
    return (
      <div className="admin-container flex-center">
        <div className="glass-panel login-card fade-in">
          <div className="login-brand">
            <Lock className="login-icon" size={32} />
            <h2 className="login-title">Acesso Restrito</h2>
            <p className="login-subtitle">Área restrita para administração do portfólio. Autentique-se com sua conta Google.</p>
          </div>

          <button onClick={loginWithGoogle} className="btn btn-primary btn-login">
            <Chrome size={20} />
            <span>Entrar com o Google</span>
          </button>

          <button onClick={() => navigate('/')} className="btn btn-secondary btn-login">
            <ArrowLeft size={18} />
            <span>Voltar ao Portfólio</span>
          </button>
        </div>

        <style>{`
          .login-card {
            max-width: 420px;
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding: 40px !important;
          }

          .login-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          .login-icon {
            color: var(--accent-primary);
          }

          .login-title {
            font-size: 1.6rem;
            font-weight: 700;
          }

          .login-subtitle {
            font-size: 0.88rem;
            color: var(--text-secondary);
          }

          .btn-login {
            width: 100%;
            padding: 14px;
          }
        `}</style>
      </div>
    );
  }

  // 4. PAINEL DE CONTROLE CRUD DO ADMINISTRADOR (Logado e Autorizado)
  return (
    <div className="dashboard-container">
      {/* Cabeçalho do Painel */}
      <header className="dashboard-header glass-panel">
        <div className="header-brand">
          <Lock className="brand-icon" size={20} />
          <span className="brand-name">Dev<span className="text-gradient">Admin</span></span>
        </div>

        {/* Informações do Usuário Autenticado */}
        <div className="admin-profile">
          <div className="profile-info">
            <span className="profile-name">{user.displayName}</span>
            <span className="profile-role">Administrador</span>
          </div>
          {user.photoURL && (
            <img src={user.photoURL} alt={user.displayName} className="profile-avatar" />
          )}
          <button onClick={logout} className="btn-logout" title="Sair do Painel">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="dashboard-content container">
        <div className="dashboard-intro">
          <div>
            <h1 className="dashboard-title">Olá, {user.displayName?.split(' ')[0]}!</h1>
            <p className="dashboard-subtitle">Gerencie todos os projetos visíveis no seu portfólio em tempo real.</p>
          </div>
          
          <div className="dashboard-actions-top">
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              <ArrowLeft size={18} />
              <span>Ver Portfólio</span>
            </button>
            <button 
              onClick={() => {
                setEditingProject(null);
                setIsFormOpen(!isFormOpen);
              }} 
              className="btn btn-primary"
            >
              {isFormOpen ? <X size={18} /> : <Plus size={18} />}
              <span>{isFormOpen ? 'Fechar' : 'Novo Projeto'}</span>
            </button>
          </div>
        </div>

        {/* Renderização do Formulário Expandido */}
        {isFormOpen && (
          <div className="form-container glass-panel fade-in">
            <ProjectForm
              project={editingProject}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingProject(null);
              }}
              isLoading={saving}
            />
          </div>
        )}

        {/* Listagem Tabela de Gerenciamento de Projetos */}
        <section className="projects-manager-section glass-panel">
          <div className="manager-header">
            <div className="manager-title-group">
              <FileCode size={18} className="manager-icon" />
              <h3>Projetos Ativos ({projects.length})</h3>
            </div>
            <span className="spark-badge">Firebase Spark</span>
          </div>

          {projects.length === 0 ? (
            <div className="manager-empty-state">
              <p>Nenhum projeto cadastrado no banco de dados.</p>
              <button 
                onClick={() => {
                  setEditingProject(null);
                  setIsFormOpen(true);
                }} 
                className="btn btn-primary btn-sm"
                style={{ marginTop: '15px' }}
              >
                <Plus size={16} />
                <span>Criar Primeiro Projeto</span>
              </button>
            </div>
          ) : (
            /* Lista Responsiva de Projetos para Admin */
            <div className="manager-list">
              {projects.map((proj) => (
                <div key={proj.id} className="manager-item">
                  {/* Thumbnail do Projeto */}
                  <div className="item-thumbnail">
                    {proj.thumbnail ? (
                      <img src={proj.thumbnail} alt={proj.name} />
                    ) : (
                      <div className="item-placeholder">🚀</div>
                    )}
                  </div>

                  {/* Informações de Texto */}
                  <div className="item-info">
                    <div className="item-title-row">
                      <h4 className="item-name">{proj.name}</h4>
                      <span className="item-order">Ordem: {proj.order || 0}</span>
                    </div>
                    <p className="item-desc">{proj.description}</p>
                    
                    {/* Tags do Stack */}
                    {proj.stack && proj.stack.length > 0 && (
                      <div className="item-stack">
                        {proj.stack.map((tech, idx) => (
                          <span key={idx} className="stack-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botões de Ações CRUD Rápidas */}
                  <div className="item-actions">
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-action-icon" title="Ver no GitHub">
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button onClick={() => handleEditClick(proj)} className="btn-action-icon btn-edit" title="Editar Projeto">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(proj.id)} className="btn-action-icon btn-delete" title="Excluir Projeto">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style>{`
        .admin-container {
          min-height: 100vh;
          padding: 20px;
          background-color: var(--bg-primary);
        }

        .dashboard-container {
          min-height: 100vh;
          background-color: var(--bg-primary);
          padding-bottom: 60px;
        }

        /* Dashboard Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 40px !important;
          border-radius: 0 !important;
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
          margin-bottom: 40px;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .profile-name {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .profile-role {
          font-size: 0.75rem;
          color: var(--accent-secondary);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid var(--accent-primary);
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-logout:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.2);
        }

        /* Content Dashboard */
        .dashboard-intro {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-title {
          font-size: 2.2rem;
          font-weight: 700;
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .dashboard-actions-top {
          display: flex;
          gap: 12px;
        }

        .form-container {
          margin-bottom: 40px;
          animation: slideDown var(--transition-normal);
        }

        /* Manager Section */
        .projects-manager-section {
          padding: 24px !important;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 18px;
          margin-bottom: 20px;
        }

        .manager-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .manager-icon {
          color: var(--accent-primary);
        }

        .spark-badge {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
          color: var(--accent-secondary);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .manager-empty-state {
          padding: 60px 0;
          text-align: center;
          color: var(--text-secondary);
        }

        /* Manager Items list */
        .manager-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .manager-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          transition: border-color var(--transition-fast);
        }

        .manager-item:hover {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .item-thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--glass-border);
          flex-shrink: 0;
        }

        .item-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.05));
        }

        .item-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0; /* Permite truncamento correto */
        }

        .item-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .item-name {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-order {
          font-size: 0.75rem;
          color: var(--accent-secondary);
          background: rgba(6, 182, 212, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .item-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .item-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .stack-tag {
          font-size: 0.7rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .item-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-action-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-action-icon:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-action-icon.btn-edit:hover {
          color: var(--accent-primary);
          background: rgba(139, 92, 246, 0.08);
          border-color: rgba(139, 92, 246, 0.2);
        }

        .btn-action-icon.btn-delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.2);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .manager-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .item-thumbnail {
            width: 100%;
            height: 140px;
          }

          .item-actions {
            width: 100%;
            justify-content: flex-end;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default Admin;
