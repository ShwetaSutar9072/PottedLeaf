# 🌿 Potted Leaf – Online Plant Store

Potted Leaf is an online plant shopping platform designed to make it easier for users to explore and purchase plants. It provides a user-friendly interface for browsing plant products and accessing plant-related assistance.

## 📌 Project Overview

Potted Leaf is developed using a full-stack architecture with React for the frontend, Spring Boot for the backend, and MySQL for database management.

## ✨ Features

- Browse and explore plant products.
- User-friendly online shopping interface.
- Backend REST API integration.
- MySQL database connectivity.
- AI-powered plant support and assistance.
- Responsive frontend interface.

## 🛠️ Technologies Used

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Build Tool | Maven |
| AI Integration | Spring AI, Google Gemini, Pinecone, Mistral |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
PottedLeaf/
│
├── Backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── .gitignore
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ShwetaSutar9072/PottedLeaf.git
cd PottedLeaf
```

### 2. Backend Setup

Open the Backend directory:

```bash
cd Backend
```

Configure your MySQL database and environment variables.

Update the database and API credentials through environment variables. Do not commit actual passwords or API keys.

Run the Spring Boot application on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 🗄️ Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE plantstore;
```

Configure your database username and password using the environment variables expected by the backend.

## 🔐 Environment Variables

Configure the required credentials locally:

- `DB_USERNAME`
- `DB_PASSWORD`
- `GOOGLE_GENAI_API_KEY`
- `PINECONE_API_KEY`
- `MISTRAL_API_KEY`

Keep credentials private. Never upload actual API keys or database passwords to GitHub.

## 👩‍💻 Developer

**Shweta Sutar**

GitHub: https://github.com/ShwetaSutar9072

## 📄 License

This project is available for educational and portfolio purposes.
