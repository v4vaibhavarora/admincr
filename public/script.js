const socket = io();

function joinChat() {
  const name = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  socket.emit("checkPassword", { name, password });
}

socket.on("join-success", () => {
  document.querySelector(".join-container").style.display = "none";
  document.querySelector(".chat-container").style.display = "block";
});

socket.on("join-failed", () => {
  document.getElementById("error-msg").innerText = "Incorrect password!";
});

function sendMessage() {
  const msg = document.getElementById("message").value;
  socket.emit("send-message", msg);
  document.getElementById("message").value = "";
}

socket.on("receive-message", (data) => {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.innerText = `${data.user}: ${data.message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("user-joined", (name) => {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.innerText = `${name} joined the chat`;
  div.style.fontStyle = "italic";
  chatBox.appendChild(div);
});

socket.on("user-left", (name) => {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.innerText = `${name} left the chat`;
  div.style.fontStyle = "italic";
  chatBox.appendChild(div);
});
