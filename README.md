
## DB Setup

Copy .env.example to .env and set `DATABASE_URL` and `PORT` to your liking.

Example for a local database: `DATABASE_URL=postgres://neill@localhost/pastebin`

You will need to create your own databases for this project - one locally and one on Heroku.

## running on heroku

When the project is deployed to heroku, the command in your `Procfile` file will be run.

### Database Schema:
  [<p><img width="35%" alt="Screenshot 2022-04-05 at 22 10 01" src="https://user-images.githubusercontent.com/32649229/165402738-6f4bdbdd-4ecf-4ff1-8eea-5ebd1c90f580.png"><p>](https://dbdiagram.io/d/625ebbb31072ae0b6aac0958)

## Environments
- Local: [https://localhost:4000/](https://localhost:4000/)

## Installation

### Mac/Linux

#### Brew:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Docker:

Please check the docker version matches the [requirements](#requirements).

```
brew cask install docker
docker --version
```

### Windows

#### Docker:
    Download via  [www.docker.com/get-started](https://www.docker.com/get-started).

#### Make:
    ```
    choco install make
    ```

#### Node:
    Download via  [nodejs.org/en/download/](https://nodejs.org/en/download/prebuilt-installer).

### Requirements
- Docker: [www.docker.com/get-started](https://www.docker.com/get-started)
- Make: [gnuwin32.sourceforge.net/packages/make.htm](https://gnuwin32.sourceforge.net/packages/make.htm)
- Node: [nodejs.org/en/download/](https://nodejs.org/en/download/prebuilt-installer)
## Run

```
make dev
```

### Initial Setup
```
make install
make build
```

## Git Workflow
