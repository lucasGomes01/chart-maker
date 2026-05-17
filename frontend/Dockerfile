FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package.json yarn.lock ./

# Instala as dependências de forma limpa
RUN yarn install

# Copia o restante do código
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Inicia o servidor do Vite em modo host para escutar na porta exposta
CMD ["yarn", "dev", "--host"]
