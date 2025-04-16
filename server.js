const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para servir archivos estáticos del cliente
app.use(express.static("public"));

// Evento cuando un cliente se conecta
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  // Escuchando mensajes enviados por el cliente
  socket.on("chat message", (data) => {
    console.log(`Mensaje recibido de ${data.username}: ${data.message}`);

    // Reenviar el mensaje a todos los clientes conectados
    io.emit("chat message", data);
  });

  // Evento cuando un usuario se desconecta
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});