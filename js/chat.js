class ChatBot {
    constructor() {
        this.isOpen = false;
        this.history = [];
        this.container = null;
        this.messagesContainer = null;
        this.input = null;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createUI();
        this.addEventListeners();
    }

    injectStyles() {
        const styles = `
            .chatbot-bubble {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
                border-radius: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                transition: transform 0.3s ease;
            }

            .chatbot-bubble:hover {
                transform: scale(1.1);
            }

            .chatbot-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: rgba(30, 41, 59, 0.95);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-lg);
                display: none;
                flex-direction: column;
                box-shadow: var(--shadow-xl);
                z-index: 10000;
                overflow: hidden;
            }

            .chatbot-window.active {
                display: flex;
            }

            .chatbot-header {
                padding: 1rem;
                background: rgba(14, 165, 233, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-title {
                font-weight: 700;
                color: var(--primary-light);
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .chat-msg {
                max-width: 80%;
                padding: 0.75rem 1rem;
                border-radius: 1rem;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .chat-msg.user {
                background: var(--primary);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 0.25rem;
            }

            .chat-msg.bot {
                background: rgba(255, 255, 255, 0.05);
                color: var(--text-primary);
                align-self: flex-start;
                border-bottom-left-radius: 0.25rem;
            }

            .chatbot-input-area {
                padding: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 0.5rem;
            }

            .chatbot-input {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-sm);
                padding: 0.5rem 0.75rem;
                color: white;
                font-family: inherit;
            }

            .chatbot-input:focus {
                outline: none;
                border-color: var(--primary);
            }

            .typing-indicator {
                font-size: 0.8rem;
                color: var(--text-muted);
                margin-left: 0.5rem;
                display: none;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    createUI() {
        // Create Bubble
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        bubble.innerHTML = '💬';
        document.body.appendChild(bubble);

        // Create Window
        const window = document.createElement('div');
        window.className = 'chatbot-window';
        window.innerHTML = `
            <div class="chatbot-header">
                <span class="chatbot-title">Raj pharma Assistant</span>
                <button class="modal-close" id="close-chat" style="position: static; font-size: 1.5rem;">&times;</button>
            </div>
            <div class="chatbot-messages" id="chat-messages">
                <div class="chat-msg bot">Hello! I'm your Raj pharma AI assistant. How can I help you today?</div>
            </div>
            <div class="typing-indicator" id="typing">Assistant is thinking...</div>
            <form class="chatbot-input-area" id="chat-form">
                <input type="text" class="chatbot-input" id="chat-input" placeholder="Type your message..." autocomplete="off">
                <button type="submit" class="btn btn-primary btn-sm" style="padding: 0.5rem;">Send</button>
            </form>
        `;
        document.body.appendChild(window);

        this.container = window;
        this.bubble = bubble;
        this.messagesContainer = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.typingIndicator = document.getElementById('typing');
    }

    addEventListeners() {
        this.bubble.addEventListener('click', () => this.toggleChat());
        document.getElementById('close-chat').addEventListener('click', () => this.toggleChat());
        document.getElementById('chat-form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('active', this.isOpen);
        if (this.isOpen) this.input.focus();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';

        await this.getAIResponse(message);
    }

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.innerText = text;
        this.messagesContainer.appendChild(msgDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Update history for Gemini
        this.history.push({
            role: sender === 'user' ? 'user' : 'model',
            parts: [{ text }]
        });
    }

    async getAIResponse(message) {
        this.typingIndicator.style.display = 'block';

        // Detect if running via file protocol
        if (window.location.protocol === 'file:') {
            this.typingIndicator.style.display = 'none';
            this.addMessage("⚠️ ERROR: You opened the file directly. Please use http://localhost:5000 to use the Chatbot.", 'bot');
            return;
        }

        try {
            // Use API_BASE_URL from api.js if available
            const baseUrl = window.API_BASE_URL || '/api';
            const url = `${baseUrl}/chat`.replace('//chat', '/chat'); // Prevent double slashes

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history: this.history.slice(0, -1) })
            });

            const data = await response.json();
            this.typingIndicator.style.display = 'none';

            if (response.ok && data.text) {
                this.addMessage(data.text, 'bot');
            } else {
                // Handle specific error messages from backend
                const errorMsg = data.message || "I'm having a technical glitch. Please try again.";
                this.addMessage(errorMsg, 'bot');

                // If it's the missing API key error, give extra advice
                if (errorMsg.includes("GEMINI_API_KEY")) {
                    this.addMessage("TIP: Please add your key to the .env file and RESTART the server.", 'bot');
                }
            }
        } catch (error) {
            this.typingIndicator.style.display = 'none';
            console.error('Chatbot error:', error);
            this.addMessage("CONNECTION ERROR: The server is not responding. Please make sure you have restarted the application after adding your API key.", 'bot');
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.rajPharmaBot = new ChatBot();
});
