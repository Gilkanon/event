# Event Microservices System

## 🚧 Project Status
This project is still under development. Some features may be incomplete or subject to change.

## 📌 Overview
The **Event Microservices System** is a distributed event management platform built using a microservices architecture. It allows users to create, manage, and participate in events.

## 🛠️ Technologies Used
- **Node.js** with **NestJS**
- **MySQL** as the database
- **Prisma ORM** for database interactions
- **RabbitMQ** for inter-service communication
- **Docker & Docker Compose** for containerization
- **AWS S3** for media storage
- **Class-validator & Class-transformer** for DTO validation

## 📂 Services
- **Gateway Service**: Entry point for all requests, responsible for authentication and routing.
- **Auth Service**: Handles user authentication and JWT-based authorization.
- **User Service**: Manages user-related operations.
- **Event Service**: Manages event creation, updates, and retrieval.

## 🚀 Running the Project
### Prerequisites
- Docker & Docker Compose installed
- Node.js & Yarn installed
- AWS S3 credentials configured
- RabbitMQ running (handled by Docker)

### Steps to Run
1. Clone the repository:
   ```sh
   git clone https://github.com/Gilkanon/event.git
   cd event
   ```
2. Create a `.env` file for each service and configure the necessary environment variables.
3. Start the project using Docker Compose:
   ```sh
   docker-compose up --build
   ```
4. Access the services via the Gateway API.

## 📌 Planned Features & Improvements
- **Notification Service**: To handle user notifications and event updates.
- **Pagination**: Implement pagination for event listing requests.
- **Advanced Access Control**: Restrict event updates to owners and administrators.
- **Improved Error Handling**: Enhance consistency in error responses.
- **Comprehensive Testing**: Add unit and integration tests.

## 📞 Contact
For any inquiries or contributions, feel free to create an issue or a pull request in the repository.

---
Stay tuned for updates! 🚀

