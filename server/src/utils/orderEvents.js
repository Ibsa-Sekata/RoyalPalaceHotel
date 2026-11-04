let socketServer = null;

export function setSocketServer(io) {
  socketServer = io;
}

export function emitOrderEvent(event, order) {
  if (!socketServer || !order) return;
  socketServer.to("kitchen").emit(event, order);
  if (order.userId) socketServer.to(`user:${order.userId}`).emit(event, order);
}
