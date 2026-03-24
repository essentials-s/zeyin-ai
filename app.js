// --- 1. Мультиязычность ---
const translations = {
    en: { newChat: "+ New Chat", lang: "Language:", apiKey: "OpenRouter API Key:", save: "Save Key", send: "Send", placeholder: "Message Zeyin AI..." },
    ru: { newChat: "+ Новый чат", lang: "Язык:", apiKey: "API ключ OpenRouter:", save: "Сохранить", send: "Отправить", placeholder: "Написать Zeyin AI..." },
    kz: { newChat: "+ Жаңа чат", lang: "Тіл:", apiKey: "OpenRouter API кілті:", save: "Сақтау", send: "Жіберу", placeholder: "Zeyin AI-ға жазу..." }
};

function changeLanguage() {
    const lang = document.getElementById('lang-select').value;
    document.getElementById('btn-new-chat').innerText = translations[lang].newChat;
    document.getElementById('lbl-lang').innerText = translations[lang].lang;
    document.getElementById('lbl-api').innerText = translations[lang].apiKey;
    document.getElementById('btn-save').innerText = translations[lang].save;
    document.getElementById('btn-send').innerText = translations[lang].send;
    document.getElementById('chat-input').placeholder = translations[lang].placeholder;
}

// --- 2. Безопасное сохранение API-ключа (Только в вашем браузере!) ---
function saveApiKey() {
    const key = document.getElementById('api-key-input').value;
    localStorage.setItem('zeyin_api_key', key);
    alert('API Key saved securely in your browser!');
}

// Загрузка ключа при открытии страницы
window.onload = () => {
    const savedKey = localStorage.getItem('zeyin_api_key');
    if (savedKey) document.getElementById('api-key-input').value = savedKey;
    changeLanguage(); // Установка языка по умолчанию
};

// --- 3. Отправка сообщения (Пример через OpenRouter) ---
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value;
    const apiKey = localStorage.getItem('zeyin_api_key');

    if (!message) return;
    if (!apiKey) {
        alert("Пожалуйста, введите и сохраните API ключ в настройках!");
        return;
    }

    // Добавляем сообщение пользователя в UI
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML += `<p><b>You:</b> ${message}</p>`;
    input.value = '';

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "anthropic/claude-3-haiku", // Или любая другая модель в OpenRouter
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // Добавляем ответ ИИ в UI
        chatHistory.innerHTML += `<p style="color:#93c5fd;"><b>Zeyin AI:</b> ${aiResponse}</p>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;

    } catch (error) {
        chatHistory.innerHTML += `<p style="color:red;"><b>Error:</b> Проверьте ваш API-ключ или подключение к интернету.</p>`;
    }
}
