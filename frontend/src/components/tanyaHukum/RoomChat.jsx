import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

import useThemeStore from "@/store/theme";
import useChatUIStore from "@/store/chatUIStore";
import useAuthStore from "@/store/auth";

import { useThreadMessages } from "@/hooks/tanyaHukum/useThreadMessages";
import { useSendMessage } from "@/hooks/tanyaHukum/useSendMessage";

const RoomChat = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [limitExceeded, setLimitExceeded] = useState(false); // 🆕 state
  const messagesEndRef = useRef(null);

  const { isDarkMode } = useThemeStore();
  const { activeThreadId } = useChatUIStore();
  const { user } = useAuthStore();

  const { data: messages = [], isLoading: isLoadingMessages } = useThreadMessages(activeThreadId);
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = () => {
    const trimmed = currentMessage.trim();
    if (!trimmed || !activeThreadId || sendMessageMutation.isLoading || limitExceeded) return;

    setCurrentMessage("");

    const optimistic = {
      id: `temp-${Date.now()}`,
      sender: "USER",
      message: trimmed,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, optimistic]);

    sendMessageMutation.mutate(
      { threadId: activeThreadId, message: trimmed },
      {
        onSettled: () => setLocalMessages([]),
        onError: (err) => {
          if (err.response?.status === 429) {
            setLimitExceeded(true); // 🚫 set batas harian
          } else {
            alert("Gagal mengirim pesan. Silakan coba lagi.");
            console.error(err);
          }
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const container = document.getElementById("scrollkebawah");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, localMessages, sendMessageMutation.isLoading]);

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Riwayat Pertanyaan
      </h1>

      {/* Chat Content Area */}
      <div id="scrollkebawah" className="flex-1 overflow-y-auto px-1 pr-3 mb-4" style={{ maxHeight: "calc(100vh - 280px)" }}>
        <div className="space-y-6">
          {isLoadingMessages ? (
            <p className="text-sm text-center text-gray-400">Memuat percakapan...</p>
          ) : (
            [...messages, ...localMessages].map((chat, idx) => (
              <div key={chat.id || idx} className="flex flex-col gap-4">
                {chat.sender === "USER" ? (
                  <div className="flex justify-end items-start gap-2">
                    <div className="flex-1 flex justify-end">
                      <div className="bg-blue-100 dark:bg-blue-800 text-gray-800 dark:text-white rounded-lg p-4 max-w-[80%]">
                        <p className="whitespace-pre-line">{chat.message}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                          {new Date(chat.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-4 max-w-[80%]">
                        <p className="whitespace-pre-line">{chat.message}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                          {new Date(chat.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {sendMessageMutation.isLoading && (
            <div className="text-sm italic text-gray-500 dark:text-gray-400">AI sedang mengetik...</div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative mt-2">
        <textarea
          placeholder="Ketik pertanyaan Anda..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={limitExceeded}
          className="w-full resize-none pl-4 pr-12 py-3 border border-gray-300 focus:border-green-500 rounded-lg text-sm dark:bg-gray-800 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
        />
        <Button
          onClick={handleSendMessage}
          disabled={sendMessageMutation.isLoading || !currentMessage.trim() || limitExceeded}
          className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1 cursor-pointer flex items-center gap-1"
          size="sm"
        >
          {sendMessageMutation.isLoading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <i className="fas fa-paper-plane" />
          )}
        </Button>
      </div>

      {/* Batasan info */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Anda dapat bertanya hingga <strong>20 kali per hari</strong>.{" "}
        {limitExceeded && <span className="text-red-500">Batas harian Anda telah tercapai.</span>}
      </div>
    </div>
  );
};

export default RoomChat;
