FROM nginx:alpine

# Copy the HTML, CSS, and JavaScript files to the Nginx HTML directory
COPY src/index.html /usr/share/nginx/html/
COPY src/css /usr/share/nginx/html/css/
COPY src/js /usr/share/nginx/html/js/
COPY src/assets /usr/share/nginx/html/assets/

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]