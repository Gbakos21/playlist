# Egyszerű, gyors static server Nginx-szel
FROM nginx:1.25-alpine

# Alap csomagok nem kellenek; csak a konfig + tartalom
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Statikus tartalom
COPY . /usr/share/nginx/html

# Biztonság kedvéért jogosultságok
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
