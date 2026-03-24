import { useState, useRef, useEffect } from "react";
import Message from "./Message";

export default function ChatWindow({ chat, updateChat, sendToAPI }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [chat.messages, loading]);

  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...chat.messages, { role: "user", content: input }];
    updateChat({ ...chat, messages: [...newMessages, { role: "assistant", content: "" }] });
    setInput(""); setLoading(true);

    await sendToAPI(newMessages, token => {
      updateChat(prev => {
        const updated = { ...prev };
        updated.messages[updated.messages.length - 1].content += token;
        return updated;
      });
    });

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full p-4 w-full">
      <div className="flex-1 overflow-auto mb-2">
        {chat.messages.map((m, i) => <Message key={i} {...m} />)}
        {loading && <div className="text-gray-400">typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          value={input} onChange={e => setInput(e.target.value)}
        />
        <button className="p-2 bg-blue-600 rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
