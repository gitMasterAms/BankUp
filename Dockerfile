# Usa a imagem oficial do Node.js
FROM node:20

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos package*
COPY package*.json ./

# Instala as dependências
RUN npm install

# Instala nodemon globalmente
RUN npm install -g nodemon

# Copia todo o restante do projeto
COPY . .

# Expõe a porta onde o app irá rodar
EXPOSE 3000

# Comando padrão ao iniciar o container
CMD ["npm", "start"]
