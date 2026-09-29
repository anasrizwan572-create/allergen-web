const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    // Show user message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    userInput.value = "";

    // Show temporary bot message
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.textContent = "Thinking...";
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            botMessage.textContent = data.error || "Something went wrong.";
            return;
        }

        // Backend returns the answer in the "answer" field
        botMessage.textContent =
            data.answer || data.response || "No answer received.";

    } catch (error) {
        botMessage.textContent =
            "Unable to connect to the backend.";
        console.error(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});