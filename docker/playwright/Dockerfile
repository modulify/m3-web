ARG NODE_IMAGE=node:24
FROM ${NODE_IMAGE}

USER root
WORKDIR /project

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable \
  && npx -y playwright@1.58.2 install --with-deps chromium \
  && chown -R node:node /ms-playwright

USER node
