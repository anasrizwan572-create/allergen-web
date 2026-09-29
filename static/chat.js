const popup = document.getElementById("chat-popup");
const toggle = document.getElementById("chat-toggle");
const box = document.getElementById("chat-messages");
const input = document.getElementById("chat-text");

function openChat() {
  popup.classList.add("open");
  popup.setAttribute("aria-hidden", "false");
  toggle.classList.add("hide");
  toggle.setAttribute("aria-expanded", "true");
  setTimeout(() => input.focus(), 250);
}
function closeChat() {
  popup.classList.remove("open");
  popup.setAttribute("aria-hidden", "true");
  toggle.classList.remove("hide");
  toggle.setAttribute("aria-expanded", "false");
  toggle.focus();
}

toggle.onclick = openChat;
document.getElementById("hero-chat-btn").onclick = openChat;
document.getElementById("chat-close").onclick = closeChat;
document.getElementById("chat-min").onclick = closeChat;
document.getElementById("chat-send").onclick = () => send(input.value);
input.addEventListener("keydown", e => { if (e.key === "Enter") send(input.value); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeChat(); });

// Quick-question chips (hero and inside chat)
document.querySelectorAll("[data-q]").forEach(btn => {
  btn.onclick = () => { openChat(); send(btn.dataset.q); };
});

function addMsg(text, who) {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.innerHTML = "<span></span><span></span><span></span>";
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

async function send(raw) {
  const text = (raw || "").trim();
  if (!text) return;
  addMsg(text, "user");
  input.value = "";
  const loading = addTyping();
  try {
    // Unchanged API call: keep your existing endpoint and field names here
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    const answer = data.answer || data.error;
    loading.className = "msg bot" + (data.answer ? "" : " error");
    loading.textContent = answer || "No response.";
  } catch {
    loading.className = "msg bot error";
    loading.textContent = "Could not reach the server. Please try again.";
  }
  box.scrollTop = box.scrollHeight;
}