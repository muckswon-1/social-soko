# frontend/Docker.dev

FROM node:22-alpine

#Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* yarn.lock* ./

RUN \
    if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install; \
    else npm install; \
    fi

COPY . .


# Expose frontend code
EXPOSE 2071

# Start the app

CMD ["npm", "run", "dev"]
