
# backend/Dockerfile

# 1) Build stage

FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json* yarn.lock* ./

RUN \
    if [ -f package-lock.json]; then npm ci; \
    elif [ -f yarn.lock]; then yarn install; \
    else npm install; \
    fi

COPY . .

#FOR TS or build scripts
# RUN npm run build


# 2) Runtime stage

FROM node:22-alpine AS runtime

WORKDIR /usr/src/app

# Only copy what we need at runtime
COPY package.json package-lock.json* yarn.lock* ./

RUN \
    if [-f package-lock.json]; then npm ci --omit=dev; \
    elif [-f yarn.lock]; then yarn install --production=true; \
    else npm install --omit=dev; \
    fi

COPY --from=builder /usr/src/app ./

EXPOSE 2070

CMD ["node", "server.js"]