import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

export default function Message({ role, content }) {
  useEffect(() => { Prism.highlightAll(); }, [content]);
  return (
    <div className="mb-2">
      <b className="text-gray-300">{role}:</b>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
