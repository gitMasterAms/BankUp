# Contexto do Frontend - BankUp

Este documento fornece uma visão geral da arquitetura, tecnologias e estrutura do projeto frontend do BankUp.

## 1. Visão Geral do Projeto

O frontend do BankUp é uma aplicação web moderna construída com **React** e **Vite**. Ele serve como a interface do usuário para a plataforma BankUp, permitindo que os usuários interajam com os serviços financeiros oferecidos. A aplicação é um Single Page Application (SPA) que utiliza roteamento do lado do cliente para navegar entre as diferentes seções.

## 2. Tecnologias e Dependências

### Principais Dependências:
- **React (`^19.1.0`):** Biblioteca principal para a construção da interface do usuário.
- **Vite (`^6.3.5`):** Ferramenta de build e desenvolvimento rápido para projetos web modernos.
- **React Router DOM (`^7.6.2`):** Para roteamento declarativo e navegação entre as páginas da aplicação.
- **React Icons (`^5.2.1`):** Para a utilização de ícones populares na interface.

### Dependências de Desenvolvimento:
- **ESLint (`^9.25.0`):** Ferramenta de linting para garantir a qualidade e a consistência do código.
- **Jest (`^30.1.1`) e Babel:** Para a execução de testes unitários e de componentes.
- **Selenium Webdriver e Chromedriver:** Para a automação de testes end-to-end no navegador.

## 3. Estrutura de Arquivos

A estrutura de arquivos do frontend está organizada da seguinte forma:

```
frontend/bankup/
├── public/         # Arquivos estáticos e imagens
├── src/            # Código-fonte da aplicação
│   ├── cobrança/     # Módulo de gerenciamento de cobranças
│   ├── components/   # Componentes reutilizáveis (Header, Footer, Sidebar)
│   ├── config/       # Configurações, como a URL da API
│   ├── Pagador/      # Módulo de gerenciamento de clientes/pagadores
│   ├── styles/       # Arquivos CSS específicos para componentes/páginas
│   ├── App.jsx       # Componente raiz que define o layout e as rotas
│   ├── main.jsx      # Ponto de entrada da aplicação React
│   └── index.css     # Estilos globais
├── .env            # Variáveis de ambiente (URL da API)
├── package.json    # Dependências e scripts do projeto
└── vite.config.js  # Arquivo de configuração do Vite
```

## 4. Componentes e Módulos

A aplicação é dividida em vários componentes e módulos funcionais:

- **Componentes Reutilizáveis (`src/components`):**
  - `Header.jsx`: Cabeçalho da aplicação.
  - `Footer.jsx`: Rodapé da aplicação.
  - `Sidebar.jsx`: Barra de navegação lateral para a área interna do sistema.
  - `Logout.jsx`: Componente para gerenciar o logout do usuário.

- **Páginas Principais (`src/`):**
  - `Login.jsx`: Página de autenticação.
  - `Cadastro.jsx`: Página de registro de novos usuários.
  - `HomeInterna.jsx`: Dashboard principal após o login.
  - `Planos.jsx`: Página de apresentação dos planos de serviço.

- **Módulos de Funcionalidade:**
  - **Cobrança (`src/cobrança`):** Contém a lógica e a interface para criar e visualizar cobranças, incluindo formulários e tabelas.
  - **Pagador (`src/Pagador`):** Responsável pelo cadastro e listagem de clientes (pagadores).

## 5. Comunicação com a API

A comunicação com o backend é centralizada no arquivo `src/config/api.js`. A URL base da API é configurada na variável de ambiente `VITE_URL` no arquivo `.env`, que aponta para `/api`. Isso sugere que o Vite está configurado para proxy reverso, redirecionando as chamadas de `/api` para o servidor backend durante o desenvolvimento.

## 6. Estilização

O projeto utiliza arquivos CSS puros para estilização. Há um arquivo de estilos globais (`src/index.css`) e uma pasta `src/styles` que contém arquivos CSS específicos para cada componente ou página, promovendo uma organização modular dos estilos.

## 7. Scripts NPM

Os principais scripts definidos no `package.json` são:
- `npm run dev`: Inicia o servidor de desenvolvimento do Vite com Hot Module Replacement (HMR).
- `npm run build`: Compila e otimiza a aplicação para produção.
- `npm run lint`: Executa o ESLint para verificar a qualidade do código.
- `npm run preview`: Inicia um servidor local para visualizar a build de produção.
