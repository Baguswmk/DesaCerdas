import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, User, Bot, History, LogIn, Plus, Edit2, Trash2, X, Menu, AlertCircle, Sparkles } from 'lucide-react';
import useAuthStore from '@/store/auth';
import { useThreads } from '@/hooks/tanyaHukum/useThreads';
import { useCreateThread } from '@/hooks/tanyaHukum/useCreateThread';
import { useDeleteThread } from '@/hooks/tanyaHukum/useDeleteThread';
import { useUpdateThreadTitle } from '@/hooks/tanyaHukum/useUpdateThreadTitle';
import { useThreadMessages } from '@/hooks/tanyaHukum/useThreadMessages';
import { useSendMessage } from '@/hooks/tanyaHukum/useSendMessage';
import { useDailyLimit } from '@/hooks/tanyaHukum/useDailyLimit';

// Guest usage hook
const useGuestUsage = () => {
    const [usage, setUsage] = useState({ current: 0, limit: 3, remaining: 3, canAsk: true });
    const [loading, setLoading] = useState(false);

    const fetchUsage = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/legal/guest/usage`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUsage(data);
            }
        } catch (error) {
            console.error('Error fetching guest usage:', error);
            setUsage({ current: 0, limit: 3, remaining: 3, canAsk: true });
        }
    };

    const askGuestQuestion = async (question) => {
        setLoading(true);
        try {
            const csrfResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/csrf-token`, {
                credentials: 'include'
            });

            let headers = {
                'Content-Type': 'application/json'
            };

            if (csrfResponse.ok) {
                const csrfData = await csrfResponse.json();
                if (csrfData.csrfToken) {
                    headers['x-csrf-token'] = csrfData.csrfToken;
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/legal/guest/ask`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                const errorData = await response.text();
                let errorMessage = 'Failed to ask question';
                try {
                    const parsed = JSON.parse(errorData);
                    errorMessage = parsed.error || parsed.message || errorMessage;
                } catch {
                    // If not JSON, use default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            await fetchUsage();
            return data;
        } catch (error) {
            console.error('Error asking guest question:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsage();
    }, []);

    return { usage, askGuestQuestion, loading, refreshUsage: fetchUsage };
};

const CompleteLegalQASystem = () => {
    const { user, isLoggedIn } = useAuthStore();
    const navigate = useNavigate();

    // State management
    const [currentMessage, setCurrentMessage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeThreadId, setActiveThreadId] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    const [guestMessages, setGuestMessages] = useState([]);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingThread, setEditingThread] = useState(null);
    const [deletingThread, setDeletingThread] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const messagesEndRef = useRef(null);

    // Hooks for logged users
    const { data: threads = [] } = useThreads();
    const { data: messages = [] } = useThreadMessages(activeThreadId);
    const { data: dailyLimit } = useDailyLimit();
    const createThread = useCreateThread();
    const deleteThread = useDeleteThread();
    const updateThreadTitle = useUpdateThreadTitle();
    const sendMessage = useSendMessage();

    // Hook for guest users
    const { usage: guestUsage, askGuestQuestion, loading: guestLoading } = useGuestUsage();

    // Auto scroll to bottom with smooth animation
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ 
            behavior: "smooth", 
            block: "end",
            inline: "nearest" 
        });
    };

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages, localMessages, guestMessages, sendMessage.isPending]);

    // Set active thread for logged users
    useEffect(() => {
        if (isLoggedIn && threads.length > 0 && !activeThreadId) {
            const lastId = localStorage.getItem("lastActiveThreadId");
            const found = threads.find((t) => t.id === lastId);
            if (found) {
                setActiveThreadId(found.id);
            } else {
                setActiveThreadId(threads[0].id);
                localStorage.setItem("lastActiveThreadId", threads[0].id);
            }
        }
    }, [threads, activeThreadId, isLoggedIn]);

    const handleSendMessage = async () => {
        const trimmed = currentMessage.trim();
        if (!trimmed) return;

        setCurrentMessage('');

        if (isLoggedIn) {
            if (!activeThreadId) {
                createThread.mutate(trimmed.length > 50 ? trimmed.substring(0, 50) + '...' : trimmed, {
                    onSuccess: (newThread) => {
                        setActiveThreadId(newThread.id);
                        localStorage.setItem("lastActiveThreadId", newThread.id);
                        setTimeout(() => {
                            sendMessage.mutate({
                                threadId: newThread.id,
                                message: trimmed
                            });
                        }, 100);
                    }
                });
            } else {
                const optimistic = {
                    id: `temp-${Date.now()}`,
                    sender: "USER",
                    message: trimmed,
                    createdAt: new Date().toISOString(),
                };
                setLocalMessages((prev) => [...prev, optimistic]);

                sendMessage.mutate(
                    { threadId: activeThreadId, message: trimmed },
                    {
                        onSettled: () => setLocalMessages([]),
                        onError: (err) => {
                            if (err.response?.status === 429) {
                                alert('Batas penggunaan harian AI tercapai (20 pertanyaan per hari).');
                            } else {
                                alert('Gagal mengirim pesan. Silakan coba lagi.');
                            }
                        },
                    }
                );
            }
        } else {
            if (!guestUsage.canAsk) {
                setShowLoginPrompt(true);
                return;
            }

            const userMessage = {
                id: Date.now(),
                sender: 'USER',
                message: trimmed,
                timestamp: new Date().toISOString()
            };

            setGuestMessages(prev => [...prev, userMessage]);

            try {
                const response = await askGuestQuestion(trimmed);

                const aiMessage = {
                    id: Date.now() + 1,
                    sender: 'AI',
                    message: response.answer,
                    timestamp: new Date().toISOString()
                };

                setGuestMessages(prev => [...prev, aiMessage]);
            } catch (error) {
                if (error.message.includes('GUEST_LIMIT_EXCEEDED')) {
                    setShowLoginPrompt(true);
                } else {
                    alert('Gagal mengirim pertanyaan. Silakan coba lagi.');
                }
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const createNewThread = () => {
        if (!isLoggedIn) return;

        createThread.mutate("Chat Baru", {
            onSuccess: (newThread) => {
                setActiveThreadId(newThread.id);
                localStorage.setItem("lastActiveThreadId", newThread.id);
            },
        });
    };

    const handleDeleteThread = async () => {
        if (deletingThread) {
            const deletedId = deletingThread.id;
            await deleteThread.mutateAsync(deletedId);

            setIsDeleteModalOpen(false);
            setDeletingThread(null);

            const remainingThreads = threads.filter((t) => t.id !== deletedId);

            if (remainingThreads.length > 0) {
                const newActiveId = remainingThreads[0].id;
                setActiveThreadId(newActiveId);
                localStorage.setItem("lastActiveThreadId", newActiveId);
            } else {
                setActiveThreadId(null);
                localStorage.removeItem("lastActiveThreadId");
            }
        }
    };

    const handleSaveEdit = async () => {
        if (editingThread && editTitle.trim()) {
            await updateThreadTitle.mutateAsync({
                id: editingThread.id,
                title: editTitle.trim(),
            });
            setIsEditModalOpen(false);
            setEditingThread(null);
        }
    };

    // Get current messages based on user type
    const getCurrentMessages = () => {
        if (!isLoggedIn) {
            return guestMessages;
        }
        return [...messages, ...localMessages];
    };

    const currentUsage = isLoggedIn ? dailyLimit : guestUsage;
    const isLoading = isLoggedIn ? sendMessage.isPending : guestLoading;
    const canAsk = currentUsage?.canAsk ?? true;

    return (
        <div className="min-h-screen mt-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isLoggedIn && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-xl">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Tanya Hukum AI</h1>
                                    <p className="text-blue-100 text-sm">Asisten Hukum Cerdas Indonesia</p>
                                </div>
                            </div>
                        </div>

                        {!canAsk && (
                            <div className="text-sm text-white bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-red-300/20">
                                <AlertCircle className="h-4 w-4" />
                                Batas pertanyaan tercapai
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex h-[calc(100vh-6rem)]">
                {/* Enhanced Sidebar for logged users */}
                {isLoggedIn && (
                    <>
                        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                          fixed md:relative md:translate-x-0 z-30 w-80 bg-white/80 backdrop-blur-lg border-r border-white/20 
                          transition-transform duration-300 ease-out shadow-xl`}>
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-gray-200/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-800">Riwayat Chat</h2>
                                        <button
                                            onClick={() => setSidebarOpen(false)}
                                            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            <X className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={createNewThread}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 
                                         rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 
                                        flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span className="font-medium">Chat Baru</span>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-3">
                                        {threads.map((thread) => (
                                            <div
                                                key={thread.id}
                                                className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                                                    activeThreadId === thread.id
                                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md'
                                                        : 'bg-white/60 hover:bg-white/80 border-gray-200/50 hover:shadow-lg hover:scale-105'
                                                }`}
                                                onClick={() => {
                                                    setActiveThreadId(thread.id);
                                                    localStorage.setItem("lastActiveThreadId", thread.id);
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={`p-2 rounded-lg ${
                                                            activeThreadId === thread.id 
                                                                ? 'bg-blue-100 text-blue-600' 
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            <MessageCircle className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-gray-900 truncate">
                                                                {thread.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {new Date(thread.createdAt).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingThread(thread);
                                                                setEditTitle(thread.title || '');
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="h-4 w-4 text-blue-600" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeletingThread(thread);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {threads.length === 0 && (
                                            <div className="text-center py-12">
                                                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                    <MessageCircle className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm">
                                                    Belum ada riwayat chat
                                                </p>
                                                <p className="text-gray-400 text-xs mt-1">
                                                    Mulai percakapan baru!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {sidebarOpen && (
                            <div
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}
                    </>
                )}

                {/* Enhanced Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm rounded-xl m-4 shadow-xl border border-white/20">
                    {/* Enhanced Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Welcome message for guests */}
                            {!isLoggedIn && getCurrentMessages().length === 0 && (
                                <div className="text-center py-16">
                                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                        <Bot className="h-12 w-12 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Selamat datang di Tanya Hukum AI
                                    </h3>
                                    <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                                        Dapatkan jawaban hukum yang akurat dan terpercaya dari AI
                                    </p>
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 max-w-md mx-auto">
                                        <div className="flex items-center gap-2 text-orange-800 mb-2">
                                            <Sparkles className="h-5 w-5" />
                                            <span className="font-semibold">Percobaan Gratis</span>
                                        </div>
                                        <p className="text-sm text-orange-700">
                                            Anda memiliki <span className="font-semibold">3 pertanyaan gratis</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Welcome message for logged users */}
                            {isLoggedIn && getCurrentMessages().length === 0 && !activeThreadId && (
                                <div className="text-center py-16">
                                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                        <MessageCircle className="h-12 w-12 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Mulai percakapan baru
                                    </h3>
                                    <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                                        Ajukan pertanyaan hukum Anda dan dapatkan jawaban dari AI
                                    </p>
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto">
                                        <p className="text-sm text-green-800">
                                            <span className="font-semibold">20 pertanyaan</span> tersedia hari ini
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Messages */}
                            {getCurrentMessages().map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'} gap-4`}
                                >
                                    {message.sender === 'AI' && (
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                            <Bot className="w-5 h-5 text-blue-600" />
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] ${message.sender === 'USER' ? 'order-1' : ''}`}>
                                        <div
                                            className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                                                message.sender === 'USER'
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200'
                                                    : 'bg-white/90 text-gray-900 shadow-gray-200 border border-white/50'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                                        </div>
                                        <p className={`text-xs text-gray-500 mt-2 px-2 ${
                                            message.sender === 'USER' ? 'text-right' : ''
                                        }`}>
                                            {new Date(message.createdAt || message.timestamp).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    {message.sender === 'USER' && (
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                            <User className="w-5 h-5 text-green-600" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Enhanced AI typing animation */}
                            {isLoading && (
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
                                            <span className="text-sm text-gray-600 font-medium">AI sedang berpikir...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Enhanced Input Area */}
                    <div className="border-t border-white/20 bg-white/50 backdrop-blur-sm p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={
                                            canAsk
                                                ? "Ketik pertanyaan hukum Anda..."
                                                : `Batas ${currentUsage?.limit} pertanyaan tercapai`
                                        }
                                        disabled={isLoading || !canAsk}
                                        className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl 
                                        focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 
                                        disabled:cursor-not-allowed transition-all duration-200 shadow-lg text-gray-900 
                                        placeholder-gray-500"
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !canAsk || !currentMessage.trim()}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                                    text-white px-8 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed 
                                    transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl 
                                    transform hover:scale-105 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="font-medium">Kirim</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span className="font-medium">Kirim</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <p className="text-sm text-gray-600">
                                    {currentUsage && (
                                        isLoggedIn
                                            ? `Sisa ${currentUsage.remaining} pertanyaan hari ini`
                                            : currentUsage.current >= currentUsage.limit
                                                ? "Batas percobaan gratis habis. Login untuk mendapatkan 20 pertanyaan per hari."
                                                : `Sisa ${currentUsage.remaining} percobaan gratis`
                                    )}
                                </p>

                                {!isLoggedIn && (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium 
                                        bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                                    >
                                        Login untuk 20 pertanyaan/hari →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-6 w-6" />
                                    <h3 className="text-xl font-bold">Batas Percobaan Tercapai</h3>
                                </div>
                                <button
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                                <p className="text-orange-800 font-medium">
                                    Anda telah menggunakan 3 pertanyaan gratis hari ini.
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-4 font-medium">
                                    Login untuk mendapatkan keuntungan lebih:
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-800 font-medium">20 pertanyaan per hari</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-blue-800 font-medium">Riwayat percakapan tersimpan</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-purple-800 font-medium">Sistem room chat</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                                    hover:to-indigo-700 text-white py-3 px-4 rounded-xl transition-all duration-200 
                                    font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Login Sekarang
                                </button>
                                <button
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl 
                                    transition-colors font-medium"
                                >
                                    Nanti Saja
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Edit Thread Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Edit2 className="h-6 w-6" />
                                    <h2 className="text-xl font-bold">Edit Judul Chat</h2>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Judul Chat
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 
                                    focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Masukkan judul chat..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                                    hover:to-indigo-700 text-white py-3 px-4 rounded-xl transition-all duration-200 
                                    font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Simpan
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl 
                                    transition-colors font-medium"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Delete Thread Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Trash2 className="h-6 w-6" />
                                    <h2 className="text-xl font-bold">Hapus Percakapan?</h2>
                                </div>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-800">
                                    Apakah Anda yakin ingin menghapus percakapan{' '}
                                    <span className="font-semibold">"{deletingThread?.title}"</span>?
                                </p>
                                <p className="text-red-700 text-sm mt-2">
                                    Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteThread}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 
                                    hover:to-red-800 text-white py-3 px-4 rounded-xl transition-all duration-200 
                                    font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Hapus
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl 
                                    transition-colors font-medium"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompleteLegalQASystem;