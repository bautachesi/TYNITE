// Conexión al servidor con Socket.IO
const socket = io();

let username = `Usuario${Math.floor(Math.random() * 1000)}`; // Nombre de usuario aleatorio
let userColor = "#ffffff"; // Color predeterminado

// Notificar al servidor el nombre y color inicial
socket.emit("user connected", { username, color: userColor });

// Función para enviar un mensaje
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (message) {
    // Enviar mensaje al servidor
    socket.emit("chat message", { username, message, color: userColor });

    // Limpiar el casillero de entrada
    input.value = "";
  }
}

// Función para abrir el selector de archivos
function openFilePicker() {
  document.getElementById("fileInput").click();
}

// Función para enviar un archivo (imagen o video)
function sendFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const data = {
        username,
        file: reader.result,
        fileType: file.type,
        color: userColor,
      };
      socket.emit("file upload", data);
    };
    reader.readAsDataURL(file);
  }
}

// Escuchar mensajes del servidor y mostrarlos en el chat
socket.on("chat message", (data) => {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("p");
  messageElement.innerHTML = `<span class="username" style="color: ${data.color};">${data.username}</span>: ${data.message}`;
  chatMessages.appendChild(messageElement);

  // Desplazar automáticamente hacia abajo
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Escuchar archivos enviados (imágenes/videos) y mostrarlos en el chat
socket.on("file upload", (data) => {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("p");
  messageElement.innerHTML = `<span class="username" style="color: ${data.color};">${data.username}</span>:<br>`;
  if (data.fileType.startsWith("image/")) {
    messageElement.innerHTML += `<img src="${data.file}" alt="Imagen enviada">`;
  } else if (data.fileType.startsWith("video/")) {
    messageElement.innerHTML += `<video controls src="${data.file}"></video>`;
  }
  chatMessages.appendChild(messageElement);

  // Desplazar automáticamente hacia abajo
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Función para alternar el mini-menú de cambiar nombre
function toggleNameMenu() {
  const nameMenu = document.getElementById("nameMenu");
  nameMenu.style.display = nameMenu.style.display === "none" ? "block" : "none";
}

// Función para guardar el nuevo nombre
function saveName() {
  const newNameInput = document.getElementById("newNameInput");
  const newName = newNameInput.value.trim();

  if (newName) {
    const previousName = username;
    username = newName;

    // Notificar al servidor el cambio de nombre
    socket.emit("name change", { previousName, newName });

    alert(`Tu nombre ha sido cambiado a: ${username}`);
    newNameInput.value = ""; // Limpiar el campo de entrada
    toggleNameMenu(); // Ocultar el menú
  } else {
    alert("Por favor, ingresa un nombre válido.");
  }
}

// Escuchar cambio de nombre desde el servidor
socket.on("name change", (data) => {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("p");
  messageElement.style.color = "yellow"; // Mensaje de notificación
  messageElement.textContent = `El usuario ${data.previousName} ahora es ${data.newName}`;
  chatMessages.appendChild(messageElement);
});

// Función para abrir ajustes
function toggleSettingsMenu() {
  const settingsMenu = document.getElementById("settingsMenu");
  settingsMenu.style.display = settingsMenu.style.display === "none" ? "block" : "none";
}

// Función para alternar entre Light Mode y Dark Mode
function toggleLightMode() {
  const lightModeButton = document.getElementById("lightModeButton");
  const chat = document.querySelector(".chat");
  const body = document.body;
  const chatInput = document.querySelector(".chat-input");
  const sidebar = document.querySelector(".sidebar");
  const nameMenu = document.querySelector(".name-menu");
  const settingsMenu = document.querySelector(".settings-menu");

  const isLightMode = body.classList.contains("light-mode");

  if (isLightMode) {
    // Volver a Dark Mode
    body.classList.remove("light-mode");
    body.style.backgroundColor = "#111";
    chat.style.backgroundImage = "url('Fondo.png')";
    chatInput.style.backgroundColor = "#222";
    sidebar.style.backgroundColor = "#111";
    nameMenu.classList.remove("light-mode");
    settingsMenu.classList.remove("light-mode");
    lightModeButton.textContent = "Light mode";
  } else {
    // Cambiar a Light Mode
    body.classList.add("light-mode");
    body.style.backgroundColor = "#fff";
    chat.style.backgroundImage = "url('Fondo-2.png')";
    chatInput.style.backgroundColor = "#fff";
    sidebar.style.backgroundColor = "#fff";
    nameMenu.classList.add("light-mode");
    settingsMenu.classList.add("light-mode");
    lightModeButton.textContent = "Dark mode";
  }
}

// Función para alternar la paleta de colores
function toggleColorPalette() {
  const colorPalette = document.getElementById("colorPalette");
  colorPalette.style.display = colorPalette.style.display === "none" ? "flex" : "none"; // Mostrar/ocultar la paleta de colores
}

// Función para cambiar el color del nombre de usuario
function changeUsernameColor(color) {
  userColor = color;

  // Notificar al servidor el cambio de color
  socket.emit("color change", { username, color });

  alert(`Tu color ha sido cambiado a: ${color}`);
}

// Escuchar cambio de color desde el servidor
socket.on("color change", (data) => {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("p");
  messageElement.style.color = "lightblue"; // Mensaje de notificación
  messageElement.textContent = `El usuario ${data.username} cambió su color a ${data.color}`;
  chatMessages.appendChild(messageElement);
});

// Añadir un listener al casillero de entrada para capturar la tecla "Enter"
document.getElementById("messageInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
    event.preventDefault(); // Evita el salto de línea
  }
});