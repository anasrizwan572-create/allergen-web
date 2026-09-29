const popup = document.getElementById("chat-popup");
const box = document.getElementById("chat-messages");
const input = document.getElementById("chat-text");

function openChat() { popup.classList.remove("hidden"); input.focus(); }

document.getElementById("chat-toggle").onclick = () => popup.classList.toggle("hidden");
document.getElementById("chat-close").onclick = () => popup.classList.add("hidden");
document.getElementById("hero-chat-btn").onclick = openChat;
document.getElementById("chat-send").onclick = send;
input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });

function addMsg(text, who) {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, "user");
  input.value = "";
  const loading = addMsg("Thinking...", "bot");
  try {
    // Apna purana endpoint aur field names yahan rakhein
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    loading.textContent = data.answer || data.error || "No response.";
  } catch {
    loading.textContent = "Could not reach the server.";
  }
}