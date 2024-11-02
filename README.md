# 📝 Kanban Board Realtime with AI & Localization

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: shricodev](https://img.shields.io/twitter/follow/shricodev.svg?style=social)](https://twitter.com/shricodev)

![GitHub repo size](https://img.shields.io/github/repo-size/shricodev/kanban-ai-realtime-localization?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/shricodev/kanban-ai-realtime-localization?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/shricodev/kanban-ai-realtime-localization?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/shricodev/kanban-ai-realtime-localization?color=red&style=plastic)

Welcome to my **Kanban Board** implementation, an advanced task management app that combines real-time collaboration, multi-language support, and AI-generated task descriptions! Built with **Tolgee** for localization, **Vercel AI SDK** for intelligent task descriptions, and **Socket.IO** for seamless real-time updates.

![Kanban Board Screenshot](https://raw.githubusercontent.com/shricodev/kanban-ai-realtime-localization/main/public/images/readme_cover.png)

## ✨ Features

- **Localization**: Automatic language detection and translation using Tolgee.
- **AI-Powered Task Descriptions**: Generate meaningful task descriptions on the fly with OpenAI & Vercel AI SDK.
- **Real-time Collaboration**: Socket.IO enables live updates for connected clients.
- **Backend with PostgreSQL & Prisma**: Reliable data storage and easy-to-manage schema with Prisma ORM.
- **Drag-and-Drop with React-Beautiful-DND**: Smooth and intuitive task management interface.
- **Tailwind CSS Styling**: Beautiful and responsive design.

## 🚀 Tech Stack

| Technology               | Description                                        |
| ------------------------ | -------------------------------------------------- |
| **Next.js**              | React framework for server-rendered applications   |
| **Tolgee**               | Multilingual support and in-app translation        |
| **Vercel AI SDK**        | Generate AI-based task descriptions                |
| **Socket.IO**            | Real-time event-based communication                |
| **PostgreSQL**           | Reliable relational database                       |
| **Prisma**               | Modern ORM for database management                 |
| **Next-Auth Credential** | Authentication framework                           |
| **Tailwind CSS**         | Utility-first CSS framework                        |
| **shadcn/ui**            | Reusable UI components from `shadcn/ui`            |
| **React-Beautiful-DND**  | Drag-and-drop library for creating beautiful lists |

## 🛠️ Getting Started

### Prerequisites

- **Node.js** and **npm**
- **PostgreSQL** database (either locally with Docker or any cloud providers.)
- Tolgee API Keys (Optional) and OpenAI API Keys

### Setup

1. **Clone the repository**:

> 💬 If you are using HTTPS protocol instead of SSH, change the git clone command accordingly.

```bash
git clone git@github.com:shricodev/kanban-ai-realtime-localization.git
cd kanban-ai-realtime-localization
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**: Rename `.env.example` to `.env` and add the required credentials:

```plaintext
# If you are using local DB with docker,
# set DATABASE_URL to: postgresql://postgres:password@localhost:5432/kanban-board
# Otherwise, set DATABASE_URL to your database URL
DATABASE_URL=

# For running the application locally, set NEXTAUTH_URL to: http://localhost:3000
NEXTAUTH_URL=

# Set NEXTAUTH_SECRET to a random cryptographic string.
# For generating a new secret, run: `openssl rand -base64 32`
NEXTAUTH_SECRET=

# Optional: For Localization.
TOLGEE_API_URL=https://app.tolgee.io
TOLGEE_API_KEY=

# Set this according to your choice.
# For example: NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=

# Set these according to your choice.
# For example: HOST=localhost, PORT=3000
HOST=localhost
PORT=3000
```

4. **Initialize the database**:

> 👀 If you wish to test the project right away with PostgreSQL inside your local machine with Docker, I have created a custom script that will initialize the database.

- **Optional: Start the Docker service**:

If the Docker service is not running, you can start it with the following command:

```bash
sudo systemctl start docker.service
```

- **Execute the script**:

```bash
bash src/start-local-db-docker.sh
```

This script should start a Docker container with PostgreSQL image. Make sure you have populated the `.env` file with the following `DATABASE_URL`

```plaintext
DATABASE_URL=postgresql://postgres:password@localhost:5432/kanban-board
```

- **Migrate the database**:

```bash
npx prisma migrate dev --name init
```

5. **Start the development server**:

```bash
npm run dev
```

If you've initialized the project with default values, your Kanban board should be running at `http://localhost:3000`.

## 📈 Usage

- **Manage Tasks**: Create tasks with realtime collaboration.
- **Real-time Updates**: See changes made by other users instantly.
- **Localization**: Switch languages with Tolgee integration.
- **AI-Generated Descriptions**: Save time by auto-generating task descriptions.

## 📚 Project Structure

- **`/prisma`**: Prisma schema for database models
- **`/components`**: Reusable React components
- **`/components/ui`**: Reusable UI components from `shadcn/ui`
- **`/src/app/api`**: Next.js API routes
- **`/public`**: Static assets
- **`/src/providers`**: Global context providers
- **`/src/tolgee`**: Tolgee integration
- **`/src/utils`**: Utility functions
- **`/src/db`**: Database instance
- **`/messages`**: Localization messages
- **`/server.ts`**: Server-side `socket.io` logic
- **`/src/hooks`**: Custom hooks

## 📝 Available Scripts

- **`npm run dev`**: Start the development server
- **`npm run build`**: Build for production
- **`npm run start`**: Run the production server
- **`npm run lint`**: Run lint checks
- **`npx prisma migrate dev`**: Run database migrations
- **`npx prisma studio`**: Access Prisma Studio for database management

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request if you’d like to improve the project. Check the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🎉 Acknowledgments

Thanks to [Tolgee](https://tolgee.io/), [OpenAI](https://openai.com/), and [Vercel](https://vercel.com/) for providing incredible APIs to build with. Special thanks to all the open-source projects and libraries that made this project possible.
