### Dockerfile multi-stage para construir y ejecutar VulnForce
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependencias de build
COPY package*.json ./
RUN npm ci --silent

# Copiar el resto y compilar
COPY . .
RUN npm run build --silent

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar artefactos de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./ || true
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "run", "start"]
