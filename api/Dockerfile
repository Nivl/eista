FROM golang:latest

# Copy the local package files to the container’s workspace.
COPY . /app

# Install the deps
RUN curl -sL https://taskfile.dev/install.sh | sh

# build the apps
RUN cd /app && task build

# Set binary as entrypoint
CMD /app/bin/api

EXPOSE 5000