FROM node:18-alpine
WORKDIR /app
COPY . /app
ENV NODE_ENV dev
RUN yarn --frozen-lockfile
RUN yarn run dev
