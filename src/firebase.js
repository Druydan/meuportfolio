import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Objeto de configuração do Firebase contendo as credenciais extraídas com segurança do arquivo .env
// O Vite expõe automaticamente as variáveis com prefixo VITE_ através de import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializa a aplicação Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o serviço do banco de dados Cloud Firestore
// O Firestore modo nativo mantém os dados do portfólio estruturados em coleções e documentos
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true // Permite salvar objetos sem erros caso propriedades opcionais sejam undefined
});

// Inicializa o serviço de Autenticação do Firebase
const auth = getAuth(app);

// Inicializa o provedor de autenticação com login social do Google
const googleProvider = new GoogleAuthProvider();
// Adiciona escopos adicionais se necessário ou solicita seleção de conta
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Exporta as instâncias configuradas para serem reutilizadas em toda a aplicação
export { db, auth, googleProvider };
