import { mockPosts, mockUsers, mockAuth } from './mockData';

// Simula delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockAPI {
  constructor() {
    this.posts = [...mockPosts];
    this.users = [...mockUsers]; 
    this.authData = { ...mockAuth };
    this.currentUser = null;
    this.token = null;
  }

  // AUTH
  async login(email, password) {
    await delay(1000);
    
    const authUser = this.authData.users.find(
      user => user.email === email && user.password === password
    );
    
    if (!authUser) {
      throw new Error('Credenciais inválidas');
    }
    
    this.currentUser = authUser.user;
    this.token = `mock-token-${Date.now()}`;
    
    return {
      user: authUser.user,
      token: this.token
    };
  }

  async logout() {
    await delay(500);
    this.currentUser = null;
    this.token = null;
    return { success: true };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // POSTS
  async getPosts(searchTerm = '') {
    await delay(800);
    
    let filteredPosts = this.posts;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredPosts = this.posts.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.description.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    return filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getPostById(id) {
    await delay(600);
    
    const post = this.posts.find(p => p.id === id);
    if (!post) {
      throw new Error('Post não encontrado');
    }
    
    return post;
  }

  async createPost(postData) {
    await delay(1000);
    
    if (!this.currentUser) {
      throw new Error('Você precisa estar logado para criar posts');
    }
    
    // Tanto professores quanto estudantes podem criar posts
    const newPost = {
      id: (Date.now()).toString(),
      ...postData,
      author: this.currentUser.name,
      authorId: this.currentUser.id,
      authorType: this.currentUser.role, // 'docente' ou 'aluno'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    this.posts.unshift(newPost);
    return newPost;
  }

  async updatePost(id, postData) {
    await delay(1000);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem editar posts');
    }
    
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('Post não encontrado');
    }
    
    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    
    return this.posts[postIndex];
  }

  async deletePost(id) {
    await delay(800);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem deletar posts');
    }
    
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('Post não encontrado');
    }
    
    this.posts.splice(postIndex, 1);
    return { success: true };
  }

  // USERS - PROFESSORES
  async getTeachers() {
    await delay(600);
    return this.users.filter(user => user.role === 'docente');
  }

  async createTeacher(userData) {
    await delay(1000);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem criar outros professores');
    }
    
    // Verifica se email já existe
    if (this.users.some(user => user.email === userData.email)) {
      throw new Error('Email já está em uso');
    }
    
    const newTeacher = {
      id: (Date.now()).toString(),
      ...userData,
      role: 'docente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(newTeacher);
    
    // Adiciona credenciais de login
    this.authData.users.push({
      email: userData.email,
      password: '123456', // Senha padrão
      user: newTeacher
    });
    
    return newTeacher;
  }

  async updateTeacher(id, userData) {
    await delay(1000);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem editar outros professores');
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Professor não encontrado');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    // Atualiza dados de auth se necessário
    const authIndex = this.authData.users.findIndex(u => u.user.id === id);
    if (authIndex !== -1) {
      this.authData.users[authIndex].user = this.users[userIndex];
    }
    
    return this.users[userIndex];
  }

  async deleteTeacher(id) {
    await delay(800);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem deletar outros professores');
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Professor não encontrado');
    }
    
    // Remove user
    this.users.splice(userIndex, 1);
    
    // Remove from auth
    const authIndex = this.authData.users.findIndex(u => u.user.id === id);
    if (authIndex !== -1) {
      this.authData.users.splice(authIndex, 1);
    }
    
    return { success: true };
  }

  // USERS - ESTUDANTES
  async getStudents() {
    await delay(600);
    return this.users.filter(user => user.role === 'aluno');
  }

  async createStudent(userData) {
    await delay(1000);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem criar estudantes');
    }
    
    // Verifica se email já existe
    if (this.users.some(user => user.email === userData.email)) {
      throw new Error('Email já está em uso');
    }
    
    const newStudent = {
      id: (Date.now()).toString(),
      ...userData,
      role: 'aluno',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(newStudent);
    return newStudent;
  }

  async updateStudent(id, userData) {
    await delay(1000);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem editar estudantes');
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Estudante não encontrado');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    return this.users[userIndex];
  }

  async deleteStudent(id) {
    await delay(800);
    
    if (!this.currentUser || this.currentUser.role !== 'docente') {
      throw new Error('Apenas professores podem deletar estudantes');
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Estudante não encontrado');
    }
    
    this.users.splice(userIndex, 1);
    return { success: true };
  }

  // COMENTÁRIOS
  async addComment(postId, commentData) {
    await delay(600);
    
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post não encontrado');
    }
    
    const newComment = {
      id: (Date.now()).toString(),
      ...commentData,
      createdAt: new Date().toISOString()
    };
    
    this.posts[postIndex].comments.push(newComment);
    return newComment;
  }
}

// Instância única da API mock
export const mockAPI = new MockAPI();
export default mockAPI;