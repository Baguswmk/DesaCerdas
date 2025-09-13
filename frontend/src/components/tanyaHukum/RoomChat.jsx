import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Menu, Bot, User, Sparkles, MessageCircle } from "lucide-react";
import { toast } from 'sonner';

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

  // Ref ke container scroll area
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [sendMessageMutation.isPending, messages, localMessages]);

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
            toast.error("Gagal mengirim pesan. Silakan coba lagi.");
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
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {windowWidth < 768 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="md:hidden text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Room Chat</h1>
                  <p className="text-blue-100 text-sm">Ruang Percakapan Hukum</p>
                </div>
              </div>
            </div>

            {/* Usage indicator */}
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-white text-sm font-medium">
                  {dailyLimitCount}/20 pertanyaan
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-white/30 backdrop-blur-sm mx-4 my-4 rounded-2xl shadow-xl border border-white/20">
          <div className="flex flex-col h-full">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6">
              <div
                ref={scrollContainerRef}
                className="max-w-4xl mx-auto space-y-6 h-full overflow-y-auto"
              >
                {isLoadingMessages && (
                  <div className="flex justify-center items-center py-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                        <span className="text-gray-700 font-medium">Memuat pesan...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Welcome message when no active thread */}
                {!activeThreadId && allMessages.length === 0 && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <MessageCircle className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Pilih atau Buat Room Chat
                    </h3>
                    <p className="text-gray-600 text-lg max-w-md mx-auto">
                      Pilih room chat dari sidebar atau buat room baru untuk memulai percakapan
                    </p>
                  </div>
                )}

                {/* Messages */}
                {allMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"} gap-4`}
                  >
                    {msg.sender === "AI" && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                    )}

                    <div className={`max-w-[75%] ${msg.sender === "USER" ? "order-1" : ""}`}>
                      <div
                        className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                          msg.sender === "USER"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200"
                            : "bg-white/90 text-gray-900 shadow-gray-200 border border-white/50"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-2 px-2 ${
                          msg.sender === "USER" ? "text-right" : ""
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>

                    {msg.sender === "USER" && (
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                ))}

                {/* AI typing animation */}
                {sendMessageMutation.isPending && (
                  <div className="flex justify-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">AI sedang membalas...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-white/20 bg-white/50 backdrop-blur-sm p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder={
                        limitExceeded
                          ? "Batas harian tercapai."
                          : !activeThreadId
                          ? "Pilih room chat terlebih dahulu..."
                          : "Ketik pertanyaan Anda..."
                      }
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={limitExceeded || !activeThreadId || sendMessageMutation.isPending}
                      className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl 
                      focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 
                      transition-all duration-200 shadow-lg text-gray-900 placeholder-gray-500
                      text-sm disabled:cursor-not-allowed"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                    text-white px-8 py-4 rounded-2xl disabled:opacity-50 transition-all duration-200 
                    shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                    disabled={sendMessageMutation.isPending || limitExceeded || !activeThreadId || !currentMessage.trim()}
                  >
                    {sendMessageMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Kirim</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        <span className="font-medium">Kirim</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Usage info and status */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">
                      {limitExceeded
                        ? "Anda telah mencapai batas 20 pertanyaan hari ini."
                        : `Anda telah menggunakan ${dailyLimitCount}/20 pertanyaan hari ini.`}
                    </p>
                    {!limitExceeded && dailyLimitCount < 20 && (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        {20 - dailyLimitCount} tersisa
                      </div>
                    )}
                  </div>

                  {activeThreadId && (
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Room: {activeThreadId.substring(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;