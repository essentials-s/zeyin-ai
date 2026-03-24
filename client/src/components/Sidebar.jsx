export default function Sidebar({ chats, setChatId }) {
  return (
    <div className="w-64 border-r border-gray-700 p-2 bg-gray-800 h-screen overflow-auto">
      <h2 className="text-white font-bold mb-2">Chats</h2>
      {chats.map(c => (
        <div key={c.id} className="p-2 text-gray-200 cursor-pointer hover:bg-gray-700"
             onClick={() => setChatId(c.id)}>
          {c.name || "New Chat"}
        </div>
      ))}
    </div>
  );
}
