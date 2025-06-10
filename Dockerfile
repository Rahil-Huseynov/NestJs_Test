# Node.js-in uyğun versiyasını seçirik
FROM node:18

# Konteynerdə app üçün qovluq yaradırıq
WORKDIR /app

# package*.json fayllarını konteynerə köçürürük
COPY package*.json ./

# Lazımi paketləri quraşdırırıq
RUN npm install

# Bütün layihə fayllarını konteynerə köçürürük
COPY . .

# NestJS layihəsini build edirik (əgər Typescript istifadə edirsinizsə)
RUN npm run build

# Konteyner 3000 portunu dinləyəcək
EXPOSE 3000

# Konteyner başladıqda bu komanda işləyəcək
CMD ["npm", "run", "start:dev"]
