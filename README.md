# Todos

## Running in dev mode

### For front-end

```bash
cd web
yarn
yarn dev
```

### For back-end

```bash
cd server
docker compose up # Start db services for development
yarn watch # Watch for typescript file changes
```

On another tab:

```bash
yarn dev
```

## Running in production

```bash
yarn build
cd server
cp .env.example .env
```

Set the env variables in `.env`. Then:

```bash
NODE_ENV=production yarn start
```

Or, with Docker - set the env variables in the [Dockerfile](./Dockerfile) and run:

```bash
docker build -t todos .
docker run -p 8080:8080 todos
```
