import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`'${socket.id}' user just connected! ✨`);

    socket.on("message", (payload) => {
      console.log("This is the message we received:", payload);
    });

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
