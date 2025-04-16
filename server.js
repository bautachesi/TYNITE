const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir los archivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));

// Conexión de usuarios
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  // Escuchar mensajes enviados por el cliente
  socket.on("chat message", (data) => {
    console.log(`Mensaje recibido: ${data.username}: ${data.message}`);

    // Enviar el mensaje a todos los clientes conectados
    io.emit("chat message", data);
  });

  // Notificar cuando un usuario se desconecta
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir los archivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));

// Conexión de usuarios
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  // Escuchar mensajes enviados por el cliente
  socket.on("chat message", (data) => {
    console.log(`Mensaje recibido: ${data.username}: ${data.message}`);

    // Enviar el mensaje a todos los clientes conectados
    io.emit("chat message", data);
  });

  // Notificar cuando un usuario se desconecta
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});