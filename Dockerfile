# Install dependencies only when needed
FROM node:alpine AS deps-main
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:alpine AS deps-web
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY web/package.json web/yarn.lock ./
RUN yarn install --frozen-lockfile


FROM node:alpine AS deps-server
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY --from=deps-main /app/node_modules ./node_modules
COPY web .
COPY server .
COPY --from=deps-web /app/node_modules ./web/node_modules
COPY --from=deps-server /app/node_modules ./server/node_modules
COPY package.json yarn.lock Gruntfile.js ./
RUN yarn build

# Production image, copy all the files and run
FROM node:alpine AS runner
WORKDIR /app

COPY --from=builder /app/server/public ./public
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/package.json ./package.json
COPY ./server/ormconfig.json ./

# Redis
ENV REDIS_URL redis://192.168.1.4:6379/0

# Postgres
ENV PG_HOST 192.168.1.4 
ENV PG_PORT 5432 
ENV PG_DB dev 
ENV PG_USER dev 
ENV PG_PASS 123 

ENV NODE_ENV production
ENV SESSION_SECRET my-super-secret
ENV PORT 8080

EXPOSE 8080

CMD ["yarn", "start"]
