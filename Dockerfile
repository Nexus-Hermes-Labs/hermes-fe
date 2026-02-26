# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

RUN npm install -g serve@14

COPY --from=builder /app/dist /app/dist

EXPOSE 3001

CMD ["serve", "-s", "/app/dist", "-l", "3001"]
