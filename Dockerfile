FROM nginx:1.14

ADD ./dist /usr/share/nginx/html
ADD ./nginx/nginx.conf /etc/nginx/
EXPOSE 80

CMD ["nginx","-g","daemon off;"]