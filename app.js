// Локализация (KK, RU, EN)
const translations = {
    en: {
        welcomeSub: "Zeyin AI is ready", enterChat: "Enter Chat", newChat: "+ New Chat",
        settings: "⚙ Settings", typeMessage: "Type a message...", send: "Send",
        langSelect: "Language:", apiKey: "OpenRouter API Key:", 
        keyWarning: "Key is saved securely in your browser.", save: "Save & Close"
    },
    ru: {
        welcomeSub: "Zeyin AI готов к работе", enterChat: "Войти в чат", newChat: "+ Новый чат",
        settings: "⚙ Настройки", typeMessage: "Введите сообщение...", send: "Отправить",
        langSelect: "Язык:", apiKey: "API Ключ OpenRouter:", 
        keyWarning: "Ключ безопасно хранится в вашем браузере.", save: "Сохранить и закрыть"
    },
    kk: {
        welcomeSub: "Zeyin AI жұмысқа дайын", enterChat: "Чатқа кіру", newChat: "+ Жаңа чат",
        settings: "⚙ Параметрлер", typeMessage: "Хабарлама жазыңыз...", send: "Жіберу",
        langSelect: "Тіл:", apiKey: "OpenRouter API кілті:", 
        keyWarning: "Кілт браузеріңізде қауіпсіз сақталады.", save: "Сақтау және жабу"
    }
};

let currentLang = localStorage.getItem('zeyin_lang') || 'en';
let chatMessages = [];

// DOM Элементы
const welcomePage = document.getElementById('welcome-page');
const chatPage = document.getElementById('chat-page');
const settingsModal = document.getElementById('settings-modal');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lang-select').value = currentLang;
    document.getElementById('api-key-input').value = localStorage.getItem('zeyin_api_key') || '';
    updateLanguage(currentLang);
});

// Перевод UI
function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('zeyin_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = translations[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = translations[lang][key];
    });
}

// Навигация
document.getElementById('enter-btn').addEventListener('click', () => {
    welcomePage.classList.remove('active');
    chatPage.style.display = 'flex'; // Включаем Flexbox для чата
});

document.getElementById('settings-btn').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

document.getElementById('save-settings-btn').addEventListener('click', () => {
    const key = document.getElementById('api-key-input').value.trim();
    localStorage.setItem('zeyin_api_key', key);
    updateLanguage(document.getElementById('lang-select').value);
    settingsModal.classList.add('hidden');
});

document.getElementById('new-chat-btn').addEventListener('click', () => {
    chatMessages = [];
    document.getElementById('chat-history').innerHTML = '';
});

// Логика Чата (API Вызов)
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const inputEl = document.getElementById('chat-input');
    const text = inputEl.value.trim();
    if (!text) return;

    const apiKey = localStorage.getItem('zeyin_api_key');
    if (!apiKey) {
        alert("Please configure API Key in Settings first.");
        settingsModal.classList.remove('hidden');
        return;
    }

    // Отображение сообщения пользователя
    appendMessage(text, 'user');
    inputEl.value = '';
    chatMessages.push({ role: "user", content: text });

    // Обращение к OpenRouter (Модель Claude от Anthropic)
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.href, // Важно для OpenRouter
                "X-Title": "Zeyin AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "anthropic/claude-3-haiku", // Замените на нужную модель
                messages: chatMessages
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        const aiResponse = data.choices[0].message.content;
        appendMessage(aiResponse, 'ai');
        chatMessages.push({ role: "assistant", content: aiResponse });

    } catch (error) {
        appendMessage(`Error: ${error.message}`, 'ai');
    }
}

function appendMessage(text, sender) {
    const history = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    history.appendChild(msgDiv);
    history.scrollTop = history.scrollHeight;
}
