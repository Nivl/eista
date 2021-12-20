FROM golang:latest

# Copy the local package files to the container’s workspace.
COPY . /app

# Install the deps
RUN curl -sL https://taskfile.dev/install.sh | sh
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# build the apps
RUN cd /app && task build

# Set binary as entrypoint
CMD /app/bin/api

EXPOSE 5000
