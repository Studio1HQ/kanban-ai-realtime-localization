// NOTE: Always Keep this 'tsconfig-paths' import at the top.
import "tsconfig-paths/register";

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { db } from "@/db";
import { Task as TTask } from "@prisma/client";
import { DraggableLocation } from "react-beautiful-dnd";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "localhost";
const port = Number(process.env.PORT) || 3000;

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
        source: DraggableLocation;
        destination: DraggableLocation;
        email: string;
      }) => {
        const { source, destination, email } = payload;

        try {
          const updatedTasks = await handleTaskDrag(email, source, destination);
          if (updatedTasks) {
            io.sockets.emit("tasks-updated", updatedTasks);
          }
        } catch (error) {
          console.error(
            "ERROR: failed to update or fetch the user tasks",
            error,
          );
        }
      },
    );

    socket.on("disconnect", () => {
      console.log(`'${socket.id}' user just disconnected! 👀`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error("ERROR: server failure", err);
      process.exit(1);
    })

    .listen(port, () => {
      console.log(`Listening on 'http://${hostname}:${port}'`);
    });
});

async function handleTaskDrag(
  email: string,
  source: DraggableLocation,
  destination: DraggableLocation,
) {
  const dbUser = await db.user.findUnique({ where: { email } });
  if (!dbUser) return;

  const tasks = await db.task.findMany({ where: { userId: dbUser.id } });
  return updateTasksInDB(tasks, source, destination);
}

async function updateTasksInDB(
  tasks: TTask[],
  source: DraggableLocation,
  destination: DraggableLocation,
) {
  const { droppableId: sourceColumn, index: sourceOrder } = source;
  const { droppableId: destinationColumn, index: destinationOrder } =
    destination;

  const taskMoved = tasks.find(
    (task) =>
      task.column === Number(sourceColumn) && task.order === sourceOrder,
  );

  if (!taskMoved) return;

  // Filter the moved task from the tasks array.
  tasks = tasks.filter((task) => task.id !== taskMoved.id);

  taskMoved.column = Number(destinationColumn);
  taskMoved.order = destinationOrder;

  const columns: { [key: number]: TTask[] } = {
    0: tasks.filter((task) => task.column === 0),
    1: tasks.filter((task) => task.column === 1),
    2: tasks.filter((task) => task.column === 2),
  };

  columns[taskMoved.column].splice(destinationOrder, 0, taskMoved);

  // Reorder each column to have sequential order values
  Object.values(columns).forEach((columnTasks) => {
    columnTasks.forEach((task, index) => {
      task.order = index;
    });
  });

  tasks = [...columns[0], ...columns[1], ...columns[2]];

  // Sort tasks by column and order before returning
  tasks.sort((a, b) =>
    a.column === b.column ? a.order - b.order : a.column - b.column,
  );

  const updateTasksPromises = tasks.map((task) =>
    db.task.update({
      where: {
        id: task.id,
      },
      data: {
        column: task.column,
        order: task.order,
      },
    }),
  );

  // Execute all updates in parallel
  await Promise.all(updateTasksPromises);

  return tasks;
}
