import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chats") || "[]");
    setChats(saved);
    if (saved[0]) setChatId(saved[0].id);
  }, []);

  useEffect(() => localStorage.setItem("chats", JSON.stringify(chats)), [chats]);

  const updateChat = (updatedChat) => {
    setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));
  };

  const sendToAPI = async (messages, onToken) => {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model: "openai/gpt-4o-mini" })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      chunk.split("\n").forEach(line => {
        if (line.startsWith("data: ")) {
          const json = line.replace("data: ", "").trim();
          if (json === "[DONE]") return;
          try {
            const parsed = JSON.parse(json);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) onToken(token);
          } catch {}
        }
      });
    }
  };

  const currentChat = chats.find(c => c.id === chatId) || { messages: [], id: Date.now() };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar chats={chats} setChatId={setChatId} />
      <ChatWindow chat={currentChat} updateChat={updateChat} sendToAPI={sendToAPI} />
    </div>
  );
}
