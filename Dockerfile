FROM node:16 

WORKDIR /app

COPY . .

RUN npm config set registry http://registry.npm.taobao.org/

RUN npm install

RUN npm run build


FROM nginx:stable-alpine

COPY dist /usr/share/nginx/html

COPY app.conf /etc/nginx/conf.d/app.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
