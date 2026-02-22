# Build and run (single stage for simplicity; node_modules needed at runtime for bundles)
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN pnpm install --no-frozen-lockfile || npm install --legacy-peer-deps

COPY . .

# Build all apps
RUN npx nx run-many -t build --projects=api-gateway,account,words,games --configuration=production

# Copy data files for words service seed
RUN cp -r apps/words/src/data dist/apps/words/data

# Default command (overridden per service in compose)
CMD ["node", "dist/apps/api-gateway/main.js"]
