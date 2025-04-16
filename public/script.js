// Conexión al servidor con Socket.IO
const socket = io();

let username = "Usuario"; // Nombre de usuario por defecto
let isLightMode = false; // Modo inicial oscuro

// Función para enviar un mensaje
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (message) {
    // Enviar mensaje al servidor
    socket.emit("chat message", { username, message });

    // Limpiar el casillero de entrada
    input.value = "";
  }
}

// Escuchar mensajes del servidor y mostrarlos en el chat
socket.on("chat message", (data) => {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("p");
  messageElement.innerHTML = `<span class="username">${data.username}</span>: ${data.message}`;
  chatMessages.appendChild(messageElement);

  // Desplazar automáticamente hacia abajo
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Actualizar todos los mensajes con el nuevo nombre
function updateAllMessages() {
  const messages = document.querySelectorAll(".chat-messages p .username");
  messages.forEach(msg => {
    msg.textContent = username;
  });
}

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
    username = newName;
    alert(`Tu nombre ha sido cambiado a: ${username}`);
    updateAllMessages(); // Actualizar los nombres en los mensajes viejos
    newNameInput.value = ""; // Limpiar el campo de entrada
    toggleNameMenu(); // Ocultar el menú
  } else {
    alert("Por favor, ingresa un nombre válido.");
  }
}

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

  if (isLightMode) {
    // Volver a Dark Mode
    body.style.backgroundColor = "#111";
    chat.style.backgroundImage = "url('Fondo.png')";
    chatInput.style.backgroundColor = "#222";
    sidebar.style.backgroundColor = "#222";
    lightModeButton.textContent = "Light mode";
  } else {
    // Cambiar a Light Mode
    body.style.backgroundColor = "#fff";
    chat.style.backgroundImage = "url('Fondo-2.png')";
    chatInput.style.backgroundColor = "#fff";
    sidebar.style.backgroundColor = "#fff";
    lightModeButton.textContent = "Dark mode";
  }

  isLightMode = !isLightMode;
}

// Función para alternar la paleta de colores
function toggleColorPalette() {
  const colorPalette = document.getElementById("colorPalette");
  colorPalette.style.display = colorPalette.style.display === "none" ? "flex" : "none";
}

// Función para cambiar el color del nombre de usuario
function changeUsernameColor(color) {
  const usernameElements = document.querySelectorAll(".username");
  usernameElements.forEach(el => {
    el.style.color = color;
  });
}

// Añadir un listener al casillero de entrada para capturar la tecla "Enter"
document.getElementById("messageInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
    event.preventDefault(); // Evita el salto de línea
  }
});