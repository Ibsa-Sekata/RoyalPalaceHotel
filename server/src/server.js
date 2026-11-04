import app from "./app.js";
import { env } from "./config/env.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { setSocketServer } from "./utils/orderEvents.js";
import { setSocketIO } from "./app.js";

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
});
io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace("Bearer ", "");
    if (!token) return next();
    try {
        socket.user = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch {
        return next(new Error("Invalid socket token"));
    }
    next();
});
io.on("connection", (socket) => {
    if (socket.user?.id) socket.join(`user:${socket.user.id}`);
    if (socket.user?.role === "ADMIN") socket.join("kitchen");
});
setSocketServer(io);
setSocketIO(io);

httpServer.listen(env.PORT, () => {
    console.log(`API on http://localhost:${env.PORT}`);
});