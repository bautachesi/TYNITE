const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Crear la aplicación Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(__dirname + "/public"));

// Ruta principal para servir "index.html"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Evento cuando un cliente se conecta
io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Recibir notificación de conexión de un usuario
  socket.on("user connected", (data) => {
    console.log(`Usuario conectado: ${data.username} con color ${data.color}`);
  });

  // Escuchar mensajes de texto enviados por los clientes
  socket.on("chat message", (data) => {
    if (data && data.username && data.message) {
      console.log(`Mensaje recibido de ${data.username}: ${data.message}`);
      // Reenviar el mensaje a todos los clientes conectados
      io.emit("chat message", data);
    } else {
      console.log("Mensaje inválido recibido:", data);
    }
  });

  // Escuchar archivos (imágenes/videos) enviados por los clientes
  socket.on("file upload", (data) => {
    if (data && data.username && data.file && data.fileType) {
      console.log(`Archivo recibido de ${data.username}: ${data.fileType}`);
      // Reenviar el archivo a todos los clientes conectados
      io.emit("file upload", data);
    } else {
      console.log("Archivo inválido recibido:", data);
    }
  });

  // Escuchar cambio de nombre
  socket.on("name change", (data) => {
    console.log(`El usuario ${data.previousName} cambió su nombre a ${data.newName}`);
    // Reenviar el evento a todos los clientes conectados
    io.emit("name change", data);
  });

  // Escuchar cambio de color
  socket.on("color change", (data) => {
    console.log(`El usuario ${data.username} cambió su color a ${data.color}`);
    // Reenviar el evento a todos los clientes conectados
    io.emit("color change", data);
  });

  // Evento cuando un cliente se desconecta
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