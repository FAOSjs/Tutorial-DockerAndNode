FROM node:16

WORKDIR /app
#optimization tec
COPY package.json .
RUN npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
         then npm install; \
         else npm install --production; \
         fi

COPY . ./

EXPOSE 4444
CMD ["node", "./src/index.js"]
