# Portfólio Profissional & Painel Administrativo Serverless (Firebase Spark)

Este é um projeto de **Portfólio Pessoal** completo, moderno e responsivo, integrado com um **Painel de Controle Administrativo protegido por login social (Google OAuth 2.0)**. O projeto foi projetado especificamente para rodar sob as restrições e limites gratuitos do **Plano Spark do Firebase**, garantindo zero custos de manutenção.

A aplicação foi construída utilizando **Vite + React**, **Vanilla CSS premium** (com suporte a Dark Theme nativo, efeitos de Glassmorphism e micro-animações de alto padrão) e integra-se diretamente ao **Cloud Firestore** e **Firebase Authentication**.

---

## 🚀 Funcionalidades

### 🌐 Área Pública (Visitante)
* **Apresentação Pessoal (Hero Section):** Foto de perfil estilizada em círculo com efeito neon gerada por inteligência artificial, cargo profissional e biografia de impacto.
* **Projetos em Destaque:** Lista dinâmica carregada diretamente do Firestore.
* **Filtros por Tecnologias:** Ao clicar nas tags de tecnologias, os projetos são filtrados dinamicamente na tela com efeito visual.
* **Links de Acesso Rápido:** Atalhos nos cards de projetos para repositório do GitHub e deploy online.
* **Redes Sociais:** Links no rodapé para GitHub, LinkedIn e E-mail comercial.

### 🔐 Painel Administrativo Protegido
* **Autenticação com Provedor Google:** Login social simples e seguro sem necessidade de senhas.
* **Segurança Baseada em UID Único (Crítica):** Apenas uma conta de e-mail do Google correspondente ao UID do Administrador configurado no `.env` e no `firestore.rules` tem permissão para acessar o painel.
* **Segurança no Banco de Dados:** Regras de escrita do Firestore bloqueadas a nível de servidor para UIDs não autorizados.
* **Tratamento Amigável de Acesso Negado:** Se um usuário logar com um e-mail do Google não cadastrado, o painel exibe uma tela amigável informando o bloqueio e **exibindo o UID da conta atual com botão de cópia**, tornando o processo de configuração inicial extremamente prático.
* **CRUD Completo de Projetos:**
  * **Criar:** Cadastro de projetos contendo Nome, Descrição, Tags de Stack (separadas por vírgula), URL de repositório, URL de deploy e URL da thumbnail externa.
  * **Editar:** Preenchimento automático do formulário para alterações em tempo real.
  * **Excluir:** Confirmação prévia de segurança antes de remover do Firestore.

---

## 🛠️ Tecnologias Utilizadas
* **Frontend:** React 18 & Vite
* **Roteamento:** React Router DOM v6
* **Iconografia:** Lucide React
* **Estilização:** Vanilla CSS (CSS moderno com variáveis globais HSL e efeitos de glassmorphism)
* **Banco de Dados:** Cloud Firestore (modo nativo, Spark)
* **Autenticação:** Firebase Authentication (Google Provider)
* **Hospedagem:** Firebase Hosting (configurado para SPA)

---

## 📦 Configuração Inicial do Ambiente

### 1. Pré-requisitos
Certifique-se de possuir o **Node.js** (versão 18 ou superior) e o **NPM** instalados.

### 2. Instalação das Dependências
Na raiz do workspace (`c:\Users\Aluno\portifolio`), execute o comando para baixar e instalar as dependências de produção e desenvolvimento do Vite e Firebase:
```bash
npm install
```

### 3. Configurando as Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do projeto (um arquivo pré-configurado já foi gerado para você baseado no `.env.example`).
Preencha as chaves com as credenciais obtidas no **Firebase Console** do seu projeto:

```env
# Configurações do Firebase Console (Plano Spark)
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=portifolio-399ba.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=portifolio-399ba
VITE_FIREBASE_STORAGE_BUCKET=portifolio-399ba.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# UID do Administrador (Será preenchido no Passo 5)
VITE_ALLOWED_UID=SEU_ALLOWED_UID_AQUI
```

---

## 🔥 Configurações no Firebase Console (Passo a Passo)

### 1. Criar o Banco de Dados Firestore
1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Abra o projeto `portifolio-399ba`.
3. No menu lateral esquerdo, clique em **Firestore Database** e depois em **Criar banco de dados**.
4. Selecione o modo de inicialização como **Modo de Produção** (ou Modo Teste se preferir liberar inicialmente, embora nossas regras locais já cubram a segurança de forma definitiva).
5. Escolha a localização geográfica ideal (ex: `us-central1` ou `southamerica-east1`) e clique em **Ativar**.

### 2. Ativar a Autenticação com o Google
1. No menu lateral, clique em **Authentication** e depois em **Começar**.
2. Na aba **Método de login**, clique em **Adicionar novo provedor** e selecione o **Google**.
3. Ative a opção, escolha um e-mail de suporte ao projeto e clique em **Salvar**.
4. _Nota:_ O Firebase adicionará automaticamente a autorização necessária de domínio para o `localhost` e para o subdomínio do seu Hosting.

---

## 🔒 Obtendo e Configurando seu UID Administrativo Único

Para blindar o seu painel de controle e impedir que qualquer outra pessoa faça alterações, implementamos a validação de UID:

1. Inicie o servidor de testes local (veja seção abaixo).
2. Clique no ícone de **cadeado discreto** no rodapé (footer) do portfólio para acessar `/admin`.
3. Clique em **Entrar com o Google** e faça login com a conta de e-mail que deseja utilizar para gerenciar o portfólio.
4. Como seu UID ainda não está configurado, o sistema exibirá a tela de **Acesso Negado**.
5. **Copie o UID exibido na tela** clicando no ícone de cópia.
6. Abra seu arquivo `.env` local e cole-o na variável:
   ```env
   VITE_ALLOWED_UID=insira_o_uid_copiado_aqui
   ```
7. Abra o arquivo `firestore.rules` na raiz do projeto e substitua o placeholder `"SEU_ALLOWED_UID_AQUI"` na linha 17 pelo seu UID copiado:
   ```javascript
   allow write: if request.auth != null && request.auth.uid == "insira_o_uid_copiado_aqui";
   ```
8. Reinicie o servidor de testes. Ao acessar `/admin` novamente, seu painel estará 100% liberado!

---

## 💻 Como Rodar e Testar Localmente

Para iniciar o servidor web do Vite localmente para testes em tempo real, execute:
```bash
npm run dev
```
O console exibirá o endereço de acesso, normalmente: `http://localhost:3000`. O Vite possui suporte nativo a *Hot Module Replacement (HMR)*, atualizando as telas instantaneamente a cada salvamento de código!

---

## 🚀 Como Fazer o Deploy no Firebase Hosting

Após testar localmente e preencher seu UID, siga estes passos simples de build e publicação usando o terminal do Google IDX:

### Passo 1: Gerar a SPA Compilada do Vite
Gere a pasta de distribuição estática otimizada da aplicação rodando:
```bash
npm run build
```
O Vite criará a pasta `dist` na raiz contendo todo o HTML, CSS e JavaScript minificados e com cache otimizado.

### Passo 2: Fazer o Deploy no Firebase Hosting e Firestore
Utilize a ferramenta de linha de comando do Firebase (Firebase CLI) para subir o banco de dados de regras e publicar o site.

Como já configuramos o arquivo `firebase.json` para direcionar a pasta pública para `dist` e habilitamos os redirecionamentos SPA:

1. Faça o deploy das regras de segurança do Firestore:
   ```bash
   npx firebase deploy --only firestore:rules
   ```
2. Faça o deploy da aplicação estática compilada para o Hosting:
   ```bash
   npx firebase deploy --only hosting
   ```
3. Caso queira subir ambos juntos:
   ```bash
   npx firebase deploy
   ```

Seu portfólio estará online no subdomínio gratuito fornecido pelo Firebase Hosting (ex: `https://portifolio-399ba.web.app` e `https://portifolio-399ba.firebaseapp.com`) com carregamento ultra rápido e segurança blindada!
