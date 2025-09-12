# --- Estágio 1: Build da Aplicação React ---
# Usamos uma imagem oficial do Node.js para criar os arquivos estáticos da aplicação.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Executa o script de build para gerar os arquivos otimizados
RUN npm run build


# --- Estágio 2: Servidor de Produção ---
# Usamos uma imagem leve do Nginx para servir os arquivos gerados.
FROM nginx:stable-alpine

# Copia os arquivos de build do estágio anterior para a pasta padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx
# Este arquivo é crucial para o React Router funcionar corretamente.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que o Nginx usa por padrão
EXPOSE 80

# O comando padrão da imagem Nginx já inicia o servidor, então não precisamos de um CMD.