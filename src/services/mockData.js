// Mock data em português para o blog
export const mockPosts = [
  {
    id: '1',
    title: 'Introdução à Programação Orientada a Objetos',
    content: `
A Programação Orientada a Objetos (POO) é um paradigma de programação que organiza o código em objetos que representam entidades do mundo real.

## Conceitos Fundamentais

### 1. Classes e Objetos
- **Classe**: Um modelo ou template que define as características e comportamentos
- **Objeto**: Uma instância específica de uma classe

### 2. Encapsulamento
O encapsulamento esconde os detalhes internos de implementação e expõe apenas o que é necessário através de métodos públicos.

### 3. Herança
Permite que uma classe filha herde características de uma classe pai, promovendo reutilização de código.

### 4. Polimorfismo
Capacidade de objetos de diferentes classes responderem ao mesmo método de maneiras distintas.

## Exemplo Prático em JavaScript

\`\`\`javascript
class Pessoa {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }

  falar() {
    return \`\${this.nome} está falando.\`;
  }
}

class Professor extends Pessoa {
  constructor(nome, idade, disciplina) {
    super(nome, idade);
    this.disciplina = disciplina;
  }

  ensinar() {
    return \`\${this.nome} está ensinando \${this.disciplina}.\`;
  }
}
\`\`\`

A POO nos ajuda a escrever código mais organizado, reutilizável e fácil de manter.
    `,
    description: 'Uma introdução completa aos conceitos fundamentais da Programação Orientada a Objetos.',
    author: 'Prof. Carlos Silva',
    authorId: '1',
    createdAt: '2024-05-20T10:30:00.000Z',
    updatedAt: '2024-05-20T10:30:00.000Z',
    likes: 15,
    tags: ['programação', 'poo', 'javascript'],
    comments: [
      {
        id: '1',
        author: 'Maria Santos',
        content: 'Excelente explicação! Agora entendi melhor os conceitos de POO.',
        createdAt: '2024-05-20T14:20:00.000Z'
      },
      {
        id: '2', 
        author: 'João Oliveira',
        content: 'Os exemplos práticos ajudaram muito. Obrigado professor!',
        createdAt: '2024-05-20T16:45:00.000Z'
      }
    ]
  },
  {
    id: '2',
    title: 'React Hooks: Guia Completo para Iniciantes',
    content: `
Os React Hooks revolucionaram a forma como escrevemos componentes React, permitindo usar estado e outras funcionalidades sem escrever classes.

## O que são React Hooks?

Hooks são funções que permitem "conectar-se" ao estado do React e recursos de ciclo de vida a partir de componentes funcionais.

## Hooks Mais Utilizados

### useState
Gerencia estado local em componentes funcionais:

\`\`\`javascript
import { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Você clicou {count} vezes</p>
      <button onClick={() => setCount(count + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
\`\`\`

### useEffect
Executa efeitos colaterais em componentes funcionais:

\`\`\`javascript
import { useEffect, useState } from 'react';

function ExemploEffect() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    // Executa após o componente montar
    fetch('/api/dados')
      .then(response => response.json())
      .then(data => setDados(data));
  }, []); // Array vazio = executa apenas uma vez

  return <div>{dados ? JSON.stringify(dados) : 'Carregando...'}</div>;
}
\`\`\`

Os Hooks tornam o código mais limpo, reutilizável e fácil de testar!
    `,
    description: 'Aprenda a usar React Hooks de forma eficiente com exemplos práticos.',
    author: 'Profa. Ana Rodrigues',
    authorId: '2',
    createdAt: '2024-05-18T14:15:00.000Z',
    updatedAt: '2024-05-19T09:20:00.000Z',
    likes: 23,
    tags: ['react', 'hooks', 'javascript'],
    comments: [
      {
        id: '3',
        author: 'Pedro Costa',
        content: 'Muito útil! Estava com dificuldade para entender useEffect.',
        createdAt: '2024-05-18T16:30:00.000Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Introdução ao Git e GitHub',
    content: `
Git é um sistema de controle de versão distribuído que permite rastrear mudanças no código e colaborar com outros desenvolvedores.

## Conceitos Básicos

### O que é Git?
Git é uma ferramenta que mantém um histórico de todas as mudanças feitas em seus arquivos, permitindo:
- Voltar a versões anteriores
- Colaborar com outros desenvolvedores  
- Criar ramificações (branches) para diferentes funcionalidades
- Mesclar (merge) mudanças de diferentes contribuidores

### O que é GitHub?
GitHub é uma plataforma online que hospeda repositórios Git, oferecendo:
- Interface web amigável
- Ferramentas de colaboração
- Issues e pull requests
- Actions para CI/CD

## Comandos Essenciais

### Configuração Inicial
\`\`\`bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
\`\`\`

### Comandos do Dia a Dia
\`\`\`bash
# Ver status dos arquivos
git status

# Adicionar arquivos ao staging
git add arquivo.txt
git add .  # Adiciona todos os arquivos

# Fazer commit
git commit -m "Mensagem descritiva"

# Enviar para o repositório remoto
git push origin main
\`\`\`

Git e GitHub são ferramentas essenciais para qualquer desenvolvedor!
    `,
    description: 'Aprenda os fundamentos do Git e GitHub para controle de versão eficiente.',
    author: 'Prof. Lucas Oliveira',
    authorId: '3',
    createdAt: '2024-05-12T11:20:00.000Z',
    updatedAt: '2024-05-12T11:20:00.000Z',
    likes: 18,
    tags: ['git', 'github', 'versionamento'],
    comments: []
  }
];

export const mockUsers = [
  // Professores
  {
    id: '1',
    username: 'carlos.silva',
    email: 'carlos.silva@escola.edu.br',
    name: 'Prof. Carlos Silva',
    role: 'docente',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: '2', 
    username: 'ana.rodrigues',
    email: 'ana.rodrigues@escola.edu.br',
    name: 'Profa. Ana Rodrigues',
    role: 'docente',
    createdAt: '2024-02-10T09:30:00.000Z',
    updatedAt: '2024-02-10T09:30:00.000Z'
  },
  {
    id: '3',
    username: 'lucas.oliveira', 
    email: 'lucas.oliveira@escola.edu.br',
    name: 'Prof. Lucas Oliveira',
    role: 'docente',
    createdAt: '2024-03-05T10:15:00.000Z',
    updatedAt: '2024-03-05T10:15:00.000Z'
  },
  // Estudantes
  {
    id: '4',
    username: 'maria.santos',
    email: 'maria.santos@estudante.edu.br', 
    name: 'Maria Santos',
    role: 'aluno',
    createdAt: '2024-03-20T14:00:00.000Z',
    updatedAt: '2024-03-20T14:00:00.000Z'
  },
  {
    id: '5',
    username: 'joao.oliveira',
    email: 'joao.oliveira@estudante.edu.br',
    name: 'João Oliveira', 
    role: 'aluno',
    createdAt: '2024-04-01T11:30:00.000Z',
    updatedAt: '2024-04-01T11:30:00.000Z'
  },
  {
    id: '6',
    username: 'pedro.costa',
    email: 'pedro.costa@estudante.edu.br',
    name: 'Pedro Costa',
    role: 'aluno', 
    createdAt: '2024-04-15T16:45:00.000Z',
    updatedAt: '2024-04-15T16:45:00.000Z'
  }
];

// Dados para login
export const mockAuth = {
  users: [
    // Professores
    {
      email: 'carlos.silva@escola.edu.br',
      password: '123456',
      user: mockUsers[0]
    },
    {
      email: 'ana.rodrigues@escola.edu.br', 
      password: '123456',
      user: mockUsers[1]
    },
    {
      email: 'lucas.oliveira@escola.edu.br',
      password: '123456', 
      user: mockUsers[2]
    },
    // Estudantes
    {
      email: 'maria.santos@estudante.edu.br',
      password: '123456',
      user: mockUsers[3]
    },
    {
      email: 'joao.oliveira@estudante.edu.br',
      password: '123456',
      user: mockUsers[4]
    },
    {
      email: 'pedro.costa@estudante.edu.br',
      password: '123456',
      user: mockUsers[5]
    }
  ]
};