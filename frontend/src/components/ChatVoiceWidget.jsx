import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Mic, Send, Globe2, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const resolveLanguage = (message) => {
  const lower = message.toLowerCase();

  if (lower.includes("spanish") || lower.includes("español") || lower.includes("es")) return "es";
  if (lower.includes("french") || lower.includes("français") || lower.includes("fr")) return "fr";
  if (lower.includes("english") || lower.includes("en")) return "en";
  return null;
};

const nlpReply = (message, setLanguage, navigate, t) => {
  const lower = message.toLowerCase();
  const languageCommand = resolveLanguage(message);

  if (languageCommand) {
    setLanguage(languageCommand);
    return t("botLanguageChanged");
  }

  if (lower.includes("dashboard") || lower.includes("home") || lower.includes("start")) {
    navigate("/dashboard");
    return t("botNavigation");
  }

  if (lower.includes("patients") || lower.includes("patient")) {
    navigate("/patients");
    return t("botPatient");
  }

  if (lower.includes("appointment") || lower.includes("book") || lower.includes("schedule")) {
    navigate("/appointments");
    return t("botAppointment");
  }

  if (lower.includes("invoice") || lower.includes("payment") || lower.includes("bill")) {
    navigate("/invoices");
    return t("botInvoice");
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return t("botHello");
  }

  if (lower.includes("outstanding") || lower.includes("balance")) {
    return t("botOutstanding");
  }

  return t("botNoMatch");
};

function ChatVoiceWidget() {
  const { language, setLanguage, languages, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: t("botHelp") }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      setSupportsSpeech(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSendMessage = (text) => {
    if (!text?.trim()) return;
    const trimmed = text.trim();
    const userMessage = { from: "user", text: trimmed };
    const botMessage = { from: "bot", text: nlpReply(trimmed, setLanguage, navigate, t) };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
    setMenuOpen(false);
  };

  const handleVoiceStart = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    recognitionRef.current.start();
  };

  const handleVoiceStop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="fixed left-6 bottom-6 z-50 flex flex-col items-center gap-3">
      {open && (
        <div className="w-80 bg-white shadow-2xl rounded-3xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span className="font-semibold">{t("assistantTitle")}</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-slate-800">
              <X size={18} />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-3 py-2 max-w-[80%] ${msg.from === "user" ? "bg-slate-900 text-white" : "bg-white text-slate-900 border"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-slate-200 bg-white p-3 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                placeholder={t("typePlaceholder")}
                className="flex-1 rounded-2xl border border-slate-300 px-3 py-2 text-slate-900"
              />
              <button
                onClick={() => handleSendMessage(input)}
                className="rounded-full bg-slate-900 p-3 text-white hover:bg-slate-800"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={listening ? handleVoiceStop : handleVoiceStart}
                disabled={!supportsSpeech}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm ${supportsSpeech ? "bg-violet-600 text-white hover:bg-violet-500" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
              >
                <Mic size={16} />
                {listening ? t("voiceAssist") + "..." : t("voiceAssist")}
              </button>
              <span className="text-xs text-slate-500">{supportsSpeech ? t("webSpeechEnabled") : t("voiceNotSupported")}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-2xl shadow-violet-500/30 ring-2 ring-white hover:bg-violet-500"
        aria-label="Open chat assistant"
      >
        <MessageCircle size={24} />
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm text-white shadow-lg hover:bg-slate-800"
          aria-label="Open language selector"
        >
          <Globe2 size={16} />
          {t("languageButton")}
        </button>
        {menuOpen && (
          <div className="absolute bottom-16 left-0 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl p-3">
            <div className="mb-2 text-sm font-semibold text-slate-700">{t("languageDropdown")}</div>
            <div className="space-y-2">
              {Object.entries(languages).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code);
                    setMenuOpen(false);
                    setMessages((prev) => [...prev, { from: "bot", text: t("botLanguageChanged") }]);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm ${language === code ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
                >
                  {info.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatVoiceWidget;
