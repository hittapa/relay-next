# Rebuild the source code only when needed
FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json /app
COPY . .
RUN npm install && npm run build
ENV NODE_ENV production
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1
COPY .env.local /app
CMD ["yarn", "start"]