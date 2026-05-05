FROM node:18-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

COPY env.sh ./env_var.sh
RUN chmod +x ./env_var.sh

EXPOSE 8080
CMD [ "sh","-c",". ./env_var.sh && npm run start" ]
