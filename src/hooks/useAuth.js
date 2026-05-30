import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// Captura o UID autorizado do arquivo .env com fallback seguro
const ALLOWED_UID = import.meta.env.VITE_ALLOWED_UID || '';

export function useAuth() {
  // Mantém o estado do usuário autenticado no Firebase
  const [user, setUser] = useState(null);
  
  // Flag que determina se o usuário logado tem privilégios de administrador
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estado que gerencia a exibição de feedbacks visuais de carregamento
  const [loading, setLoading] = useState(true);
  
  // Armazena e exibe mensagens de erro de permissão ou autenticação
  const [authError, setAuthError] = useState(null);

  // Armazena o UID da conta Google que falhou ao tentar logar sem autorização
  const [failedUid, setFailedUid] = useState('');

  useEffect(() => {
    // Escuta as alterações no estado de autenticação (login, logout, reinicialização)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        // Se o usuário logou, comparamos o UID dele com o ALLOWED_UID
        if (ALLOWED_UID && currentUser.uid === ALLOWED_UID) {
          setUser(currentUser);
          setIsAdmin(true);
          setAuthError(null);
          setFailedUid('');
        } else {
          // SE O UID NÃO BATER (Tentativa de login por conta Google não autorizada)
          // Gravamos o UID mal-sucedido no estado para exibição direta e limpa no frontend
          setFailedUid(currentUser.uid);
          setAuthError(`Acesso negado. O UID "${currentUser.uid}" não está autorizado a acessar o painel administrativo.`);
          setUser(null);
          setIsAdmin(false);
          
          // Desloga imediatamente o usuário no Firebase Auth
          await signOut(auth);
        }
      } else {
        // Sem usuário ativo na sessão
        setUser(null);
        setIsAdmin(false);
        // Mantemos o erro intacto se ele vier de uma rejeição de UID, impedindo que o signOut
        // limpe o estado de forma concorrente e suma com as informações na tela de Acesso Negado.
      }
      
      setLoading(false);
    });

    // Retorna a função de unsubscribe para evitar memory leaks ao desmontar o hook
    return () => unsubscribe();
  }, []);

  /**
   * Função para realizar o login social com o Google via Pop-up
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    setFailedUid('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro durante a autenticação com Google:", error);
      // Trata erros comuns como fechamento do pop-up pelo usuário
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('O login foi cancelado porque a janela de autenticação do Google foi fechada.');
      } else {
        setAuthError(`Falha na autenticação: ${error.message}`);
      }
      setLoading(false);
    }
  };

  /**
   * Função para deslogar o usuário ativo
   */
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setAuthError(null);
      setFailedUid('');
    } catch (error) {
      console.error("Erro ao tentar deslogar:", error);
      setAuthError(`Erro ao sair: ${error.message}`);
    }
    setLoading(false);
  };

  return {
    user,
    isAdmin,
    loading,
    authError,
    failedUid,
    loginWithGoogle,
    logout,
    allowedUid: ALLOWED_UID
  };
}
