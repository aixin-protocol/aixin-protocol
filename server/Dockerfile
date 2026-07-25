FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm i --omit=dev --no-audit --no-fund
COPY src ./src
COPY schemas ./schemas
ENV PORT=8787
EXPOSE 8787
CMD ["node", "src/server.mjs"]
