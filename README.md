# Blog Educacional - App React Native

Este é um aplicativo React Native desenvolvido para gerenciar um blog educacional, permitindo que professores criem, editem e gerenciem posts, além de administrar professores e estudantes.

## 📱 Funcionalidades

### Autenticação
- ✅ Login para professores
- ✅ Controle de acesso baseado em perfil
- ✅ Logout seguro

### Gestão de Posts
- ✅ **Página principal**: Lista de posts com busca por palavras-chave
- ✅ **Leitura de posts**: Visualização completa com sistema de comentários
- ✅ **Criação de posts**: Formulário completo para professores
- ✅ **Edição de posts**: Atualização de posts existentes
- ✅ **Exclusão de posts**: Remoção com confirmação

### Gestão de Usuários
- ✅ **Professores**: Criar, editar, listar e excluir professores
- ✅ **Estudantes**: Criar, editar, listar e excluir estudantes
- ✅ **Perfis diferenciados**: Professores têm acesso administrativo

### Painel Administrativo
- ✅ **Dashboard**: Estatísticas e visão geral dos posts
- ✅ **Gerenciamento**: Editar e excluir posts diretamente
- ✅ **Navegação intuitiva**: Acesso rápido a todas as funcionalidades

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente
- Dispositivo físico com Expo Go ou emulador

### Instalação

1. **Clone ou navegue até o diretório do projeto:**
   ```bash
   cd BlogApp
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o aplicativo:**
   ```bash
   npm start
   ```

4. **Acesse no dispositivo:**
   - Escaneie o QR code com o app Expo Go (Android/iOS)
   - Ou use um emulador iOS/Android

## 🔐 Credenciais de Teste

### 👨‍🏫 Professores (Acesso Administrativo):
```
Email: carlos.silva@escola.edu.br
Senha: 123456

Email: ana.rodrigues@escola.edu.br  
Senha: 123456

Email: lucas.oliveira@escola.edu.br
Senha: 123456
```

### 👨‍🎓 Estudantes (Acesso Limitado):
```
Email: maria.santos@estudante.edu.br
Senha: 123456

Email: joao.oliveira@estudante.edu.br
Senha: 123456

Email: pedro.costa@estudante.edu.br
Senha: 123456
```

**Diferenças de Acesso:**
- **Professores**: Acesso completo - podem gerenciar posts, usuários e ter acesso administrativo
- **Estudantes**: Podem criar posts, comentar e visualizar conteúdo, mas sem privilégios administrativos

## 📚 Estrutura do Projeto

```
src/
├── navigation/
│   └── AppNavigator.js      # Configuração de navegação
├── screens/
│   ├── LoginScreen.js       # Tela de login
│   ├── PostListScreen.js    # Lista de posts
│   ├── PostDetailScreen.js  # Detalhes do post
│   ├── CreatePostScreen.js  # Criar post
│   ├── EditPostScreen.js    # Editar post
│   ├── AdminScreen.js       # Painel administrativo
│   ├── TeacherListScreen.js # Lista de professores
│   ├── CreateTeacherScreen.js # Criar professor
│   ├── EditTeacherScreen.js # Editar professor
│   ├── StudentListScreen.js # Lista de estudantes
│   ├── CreateStudentScreen.js # Criar estudante
│   └── EditStudentScreen.js # Editar estudante
├── services/
│   ├── api.js              # API mock com todas as operações
│   └── mockData.js         # Dados de exemplo em português
└── context/
    └── AuthContext.js      # Context de autenticação
```

## 🎨 Design e UX

- **Interface intuitiva** com Material Design (React Native Paper)
- **Navegação por abas** para professores autenticados
- **Busca em tempo real** na lista de posts
- **Formulários validados** com feedback visual
- **Confirmações de ações** críticas (exclusões)
- **Loading states** para melhor experiência do usuário

## 📊 Dados Mock

O aplicativo utiliza dados simulados (mock) em português, incluindo:
- **3 posts educacionais** completos com comentários
- **3 professores** cadastrados
- **3 estudantes** cadastrados
- **Sistema de comentários** funcional
- **Tags e categorização** de posts

## 🔧 Funcionalidades Técnicas

### Autenticação
- Armazenamento seguro de credenciais (Expo SecureStore)
- Contexto de autenticação global
- Controle de acesso baseado em roles

### Navegação
- Stack Navigation para fluxos lineares
- Tab Navigation para acesso rápido
- Deep linking para posts específicos

### Gerenciamento de Estado
- Context API para autenticação
- Estado local para formulários
- Cache de dados com refresh manual

### Validações
- Validação de email em tempo real
- Verificação de campos obrigatórios
- Feedback visual de erros

## 📱 Compatibilidade

- ✅ iOS (iPhone/iPad)
- ✅ Android
- ✅ Expo Web (funcionalidade limitada)

## 🎯 **Experiência do Usuário**

### **Interface para Professores:**
- ✅ **4 abas de navegação**: Posts, Admin, Professores, Estudantes
- ✅ **Painel administrativo** completo com estatísticas
- ✅ **Gerenciamento total** de posts (criar, editar, excluir)
- ✅ **Administração de usuários** (professores e estudantes)
- ✅ **Acesso a todas as funcionalidades** do sistema

### **Interface para Estudantes:**
- ✅ **2 abas de navegação**: Posts, Criar Post
- ✅ **Visualizar e pesquisar** todos os posts
- ✅ **Criar novos posts** com formulário completo
- ✅ **Comentar em posts** de outros usuários
- ❌ **Sem acesso administrativo** (não podem editar/excluir posts alheios)

## 🤝 Contribuição

Este é um projeto educacional desenvolvido seguindo as especificações fornecidas. Todas as funcionalidades solicitadas foram implementadas com dados em português e interface intuitiva.

## 📄 Licença

Projeto desenvolvido para fins educacionais.