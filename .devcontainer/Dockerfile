# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=18
FROM mcr.microsoft.com/devcontainers/typescript-node:${NODE_VERSION}

# Install PlantUML and Graphviz
USER root
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        graphviz \
        default-jre-headless \
        curl \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar -o /usr/local/share/plantuml/plantuml.jar \
    && printf '#!/usr/bin/env bash\nexec java -jar /usr/local/share/plantuml/plantuml.jar "$@"\n' > /usr/local/bin/plantuml \
    && chmod +x /usr/local/bin/plantuml

# Ensure node user owns workspace
RUN mkdir -p /workspaces && chown -R node:node /workspaces

USER node