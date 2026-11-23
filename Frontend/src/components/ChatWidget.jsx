import { useEffect, useRef, useState } from "react";
import { askChatbot } from "../api.js";

const GREETING = "Hi! I'm the Potted Leaf assistant. Ask me about plant care, products, delivery or returns.";
const SUGGESTIONS = [
  "How often should I water a snake plant?",
  "What is your return policy?",
  "How long does delivery take?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([{ role: "bot", text: GREETING }]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy, open]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(q) {
    q = q.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setText("");
    setBusy(true);
    try {
      const answer = await askChatbot(q);
      setMessages((m) => [...m, { role: "bot", text: answer || "I'm unable to verify that information right now. Please contact Potted Leaf customer support." }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "bot", text: err.message, error: true }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  const showChips = messages.length === 1;

  return (
    <>
      {open && (
        <section className="chat-panel" role="dialog" aria-label="Potted Leaf support chat">
          <div className="chat-head">
            <div>
              <strong>Potted Leaf Support</strong>
              <small>Plants, orders, delivery and returns</small>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className="chat-body" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={"chat-msg " + m.role + (m.error ? " error" : "")}>{m.text}</div>
            ))}
            {busy && (
              <div className="chat-msg bot" aria-label="Assistant is typing">
                <span className="chat-dots"><span /><span /><span /></span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {showChips && (
            <div className="chat-chips">
              {SUGGESTIONS.map((s) => (
                <button type="button" key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chat-form">
            <input
              ref={inputRef}
              value={text}
              maxLength={500}
              placeholder="Type your question"
              aria-label="Your question"
              disabled={busy}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(text)}
            />
            <button type="button" onClick={() => send(text)} disabled={busy || !text.trim()}>Send</button>
          </div>
        </section>
      )}

      <button
        type="button"
        className="chat-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
      >
        {open ? "×" : "🪴"}
      </button>
    </>
  );
}