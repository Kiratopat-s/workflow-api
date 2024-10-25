# Workflow API

## Overview

Workflow API is a NestJS-based application designed to manage various workflows. It includes modules for items, users, authentication, budgets, and GitHub integration.

## Demo

You can access a live demo of the Workflow API [here](https://api.kirato.online).

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

## Features

- **Items Management**: CRUD operations for items.
- **User Management**: User registration and authentication.
- **Budget Management**: Manage budgets and expenses.
- **GitHub Integration**: Fetch commit activity from GitHub repositories.
- **Middleware**: Custom middleware for logging login attempts.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Passport**: Authentication middleware for Node.js.
- **JWT**: JSON Web Tokens for secure authentication.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **RxJS**: Reactive Extensions Library for JavaScript.
- **Prettier**: An opinionated code formatter.
- **ESLint**: A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **Supertest**: A library for testing Node.js HTTP servers.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/workflow-api.git
   cd workflow-api
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Configuration

Environment variables are used to configure the application. Create a `.env` file in the root directory and add the following variables:

```env
# Application configuration
APPNAME=
APPVERSION=
APP_PORT=

# Database configuration
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_AUTO_LOAD_ENTITIES=
DB_SYNCHRONIZE=

# OAUTH2 configuration
OAUTH2_AUTH_URL=
OAUTH2_TOKEN_URL=
OAUTH2_CLIENT_ID=
OAUTH2_CLIENT_SECRET=
OAUTH2_CALLBACK_URL=
OAUTH2_SCOPE=
OAUTH2_RESPONSE_TYPE=

Github token
GITHUB_TOKEN=
```

## Running the Application

1. **Development mode**:
   ```bash
   pnpm dev
   ```
2. **Production mode**:
   ```bash
   pnpm start:prod
   ```

## API Endpoints

### Items

- GET /items: Retrieve all items.
- POST /items: Create a new item.
- GET /items/:id: Retrieve a specific item.
- PATCH /items/:id: Update a specific item.
- DELETE /items/:id: Delete a specific item.

### Users

- POST /auth/register: Register a new user.
- POST /auth/login: Login a user.

### GitHub

- GET /github/total-commits: Retrieve total commit activity for specified repositories.

## Testing

1. **Unit tests**:
   ```bash
   pnpm test
   ```
2. **End-to-end tests**:
   ```bash
    pnpm test:e2e
   ```
3. **Test coverage**:
   ```bash
   pnpm test:cov
   ```

### Explanation:

- **Technologies**: Added a section listing the key technologies used in the project.
- **Installation**: Instructions for cloning the repository and installing dependencies.
- **Configuration**: Details on setting up environment variables and database configuration.
- **Running the Application**: Commands to run the application in different modes.
- **API Endpoints**: Lists the available API endpoints with brief descriptions.
- **Testing**: Commands to run unit tests, end-to-end tests, and check test coverage.
- **Contributing**: Guidelines for contributing to the project.
- **License**: Information about the project's license.

This [README.md](http://_vscodecontentref_/#%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fkiratipatsawangsisombat%2FDesktop%2Fdevpool%2Fworkflow-api%2FREADME.md%22%2C%22path%22%3A%22%2FUsers%2Fkiratipatsawangsisombat%2FDesktop%2Fdevpool%2Fworkflow-api%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%7D) provides a comprehensive guide for developers to understand, set up, and contribute to the project.
