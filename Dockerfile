# One environment for everyone: the same Node, the same install, and no root
# user, on every computer and in CI. docker-compose.yml runs two of them:
# `dev` (the Vite dev server) and `preview` (the production build, served
# with vercel.json's security headers).

# Node 24 (the version in .nvmrc), pinned by digest so the image can't change
# under us. Dependabot proposes updates.
FROM node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205 AS base
WORKDIR /app
# The image comes with a non-root user, "node". Everything runs as that user.
RUN chown node:node /app
USER node
# The dependencies first, so editing app code doesn't redo the install.
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .

# The production build behind vercel.json's headers, like Vercel serves it.
# The QA agent and CI's Docker job test this one.
FROM base AS preview
RUN npm run build
EXPOSE 4174
CMD ["node", "scripts/serve-preview.mjs", "4174"]
