// NOTE: Always Keep this 'tsconfig-paths' import at the top.
import "tsconfig-paths/register";

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { db } from "@/db";
import { Task as TTask } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`'${socket.id}' user just connected! ✨`);

    socket.on("task-created", async (payload: TTask) => {
      io.sockets.emit("task-created", payload);
    });

    socket.on(
      "task-drag",
      async (payload: {
        id: string;
        newColumn: number;
        newOrder: number;
        email: string;
      }) => {
        console.log("This is the payload we received:", payload);

        const { id: taskId, newColumn, newOrder, email } = payload;
        const dbUser = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!dbUser) return;

        const tasks = await db.task.findMany({
          where: {
            userId: dbUser.id,
          },
        });

        console.log(tasks);

        const updatedTasks = await updateTaskInDB(
          tasks,
          taskId,
          newColumn,
          newOrder,
        );

        console.log("this is the updated tasks", updatedTasks);

        io.sockets.emit("tasks-updated", updatedTasks);
      },
    );

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`'${socket.id}' user just disconnected! 👀`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })

    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

async function updateTaskInDB(
  tasks: TTask[],
  taskId: string,
  newColumn: number,
  newOrder: number,
) {
  const taskToMove = tasks.find((task) => task.id === taskId);
  if (!taskToMove) return;

  await db.task.update({
    where: { id: taskId },
    data: {
      column: newColumn,
      order: newOrder,
    },
  });

  const sortedTasks = await db.task.findMany({
    where: {
      userId: taskToMove.userId,
    },
    orderBy: [{ column: "asc" }, { order: "asc" }],
  });

  return sortedTasks;
}
