# QuizIQ

A full-stack, role-based quiz application.

## Project Structure
- `backend/`: Spring Boot application (Java 17, Maven)
- `frontend/`: React application (Vite)
- `docker-compose.yml`: Local PostgreSQL setup

## Getting Started

### Prerequisites
- Java 17
- Node.js (v18+)
- Local PostgreSQL instance

### Setup Database
1. Create a database named `quiziq` in your local PostgreSQL.
2. Update `backend/src/main/resources/application.properties` with your local username and password.

### Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```
