import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

API_URL = os.environ.get(
    "API_URL",
    "https://dynamic-food-delivery-allergen-rag-production.up.railway.app"
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    try:
        response = requests.post(
            f"{API_URL}/query",
            json={"query": user_message},
            timeout=60
        )

        response.raise_for_status()
        return jsonify(response.json())

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 502


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)