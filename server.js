const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(__dirname + "/public"));

// Ruta predeterminada para servir "index.html" cuando accedas a "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Evento cuando un cliente se conecta
io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Escuchar mensajes del cliente
  socket.on("chat message", (data) => {
    if (data && data.username && data.message) {
      console.log(`Mensaje recibido de ${data.username}: ${data.message}`);
      // Reenviar el mensaje a todos los clientes conectados
      io.emit("chat message", data);
    } else {
      console.log("Mensaje inválido recibido:", data);
    }
  });

  // Evento cuando un usuario se desconecta
  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Manejo de errores del servidor
server.on("error", (err) => {
  console.error("Error en el servidor:", err);
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Manejo de señales del sistema para detener el servidor
process.on("SIGINT", () => {
  console.log("Servidor detenido");
  process.exit();
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});