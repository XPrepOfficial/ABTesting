# ---------- Builder ----------
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Runtime ----------
FROM node:18-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

COPY env.sh ./env_var.sh
RUN chmod +x ./env_var.sh


EXPOSE 8080
CMD [ "sh","-c",". ./env_var.sh && npm run start" ]

