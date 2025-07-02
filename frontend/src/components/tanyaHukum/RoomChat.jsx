import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

import useThemeStore from "@/store/theme";
import useChatUIStore from "@/store/chatUIStore";
import useAuthStore from "@/store/auth";

import { useThreadMessages } from "@/hooks/tanyaHukum/useThreadMessages";
import { useSendMessage } from "@/hooks/tanyaHukum/useSendMessage";
import { useDailyLimit } from "@/hooks/tanyaHukum/useDailyLimit";

const RoomChat = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { activeThreadId, toggleSidebar } = useChatUIStore();
  const { user } = useAuthStore();
  const { data: dailyLimit } = useDailyLimit();
  const dailyLimitCount = dailyLimit?.count || 0;

  const { data: messages = [], isLoading: isLoadingMessages } =
    useThreadMessages(activeThreadId);

  const sendMessageMutation = useSendMessage();
  const allMessages = [...messages, ...localMessages];

  // ✅ Ref ke container scroll area
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [sendMessageMutation.isPending]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, localMessages]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = () => {
    const trimmed = currentMessage.trim();
    if (
      !trimmed ||
      !activeThreadId ||
      sendMessageMutation.isPending ||
      limitExceeded
    )
      return;

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
            setLimitExceeded(true);
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

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-bold">Riwayat Pertanyaan</h1>
        {windowWidth < 768 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden !rounded-button cursor-pointer"
          >
            <i className="fas fa-bars text-xl"></i>
            <span className="sr-only">Open Sidebar</span>
          </Button>
        )}
      </div>

      {/* Chat Messages */}
      <ScrollArea className="p-4 max-h-[65vh] md:max-h-[70vh]">
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto max-h-[65vh] md:max-h-[70vh] space-y-6 max-w-4xl mx-auto"
        >
          {isLoadingMessages && (
            <div className="flex justify-center bg-white">
              <Loader2 className="animate-spin mr-2" />
              Memuat pesan...
            </div>
          )}

          {allMessages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender === "USER"
                  ? "flex flex-row-reverse gap-4"
                  : "flex gap-4"
              }
            >
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback
                  className={
                    msg.sender === "USER"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }
                >
                  {msg.sender === "USER" ? user?.name?.[0] || "U" : "AI"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div
                  className={`${
                    msg.sender === "USER"
                      ? "bg-blue-50 ml-auto max-w-md text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  } p-4 rounded-lg`}
                >
                  <p>{msg.message}</p>
                </div>
                <p
                  className={`text-xs text-gray-500 ${
                    msg.sender === "USER" ? "text-right" : ""
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          {/* ✅ AI typing animation */}
          {sendMessageMutation.isPending && (
            <div key="ai-typing" className="flex gap-4">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-100 text-gray-800 p-4 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span>Sedang membalas...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder={
                limitExceeded
                  ? "Batas harian tercapai."
                  : "Ketik pertanyaan Anda..."
              }
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={limitExceeded}
              className="pr-12 py-6 border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 !rounded-button"
              size="icon"
              disabled={sendMessageMutation.isPending || limitExceeded}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {limitExceeded
              ? "Anda telah mencapai batas 20 pertanyaan hari ini."
              : `Anda telah menggunakan ${dailyLimitCount}/20 pertanyaan hari ini.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
