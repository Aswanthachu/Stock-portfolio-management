#docker build --progress=plain --no-cache -t kks-backend .
#docker run -d -p 7000:7000 kks-backend

FROM node:18
WORKDIR /app 
EXPOSE 7000
RUN npm i -g pm2

COPY package.json ./
RUN npm i 
COPY . .

CMD [ "pm2-runtime","start","npm","--name","kks-backend","--","start" ]
