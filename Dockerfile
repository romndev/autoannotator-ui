FROM node:18-alpine
WORKDIR /app
COPY . /app
EXPOSE 5173
RUN yarn --frozen-lockfile
CMD [ "yarn", "dev" ]
