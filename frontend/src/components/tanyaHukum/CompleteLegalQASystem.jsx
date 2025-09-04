import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, User, Bot, History, LogIn, Plus, Edit2, Trash2, X, Menu, AlertCircle } from 'lucide-react';
import useAuthStore from '@/store/auth';
import { useThreads } from '@/hooks/tanyaHukum/useThreads';
import { useCreateThread } from '@/hooks/tanyaHukum/useCreateThread';
import { useDeleteThread } from '@/hooks/tanyaHukum/useDeleteThread';
import { useUpdateThreadTitle } from '@/hooks/tanyaHukum/useUpdateThreadTitle';
import { useThreadMessages } from '@/hooks/tanyaHukum/useThreadMessages';
import { useSendMessage } from '@/hooks/tanyaHukum/useSendMessage';
import { useDailyLimit } from '@/hooks/tanyaHukum/useDailyLimit';

// Guest usage hook
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
            // Set default usage on error
            setUsage({ current: 0, limit: 3, remaining: 3, canAsk: true });
        }
    };

    const askGuestQuestion = async (question) => {
        setLoading(true);
        try {
            // Get CSRF token first
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
            await fetchUsage(); // Refresh usage after successful question
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

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
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
            // Logged user flow
            if (!activeThreadId) {
                // Create new thread if none exists
                createThread.mutate(trimmed.length > 50 ? trimmed.substring(0, 50) + '...' : trimmed, {
                    onSuccess: (newThread) => {
                        setActiveThreadId(newThread.id);
                        localStorage.setItem("lastActiveThreadId", newThread.id);
                        // Send message to the new thread
                        setTimeout(() => {
                            sendMessage.mutate({
                                threadId: newThread.id,
                                message: trimmed
                            });
                        }, 100);
                    }
                });
            } else {
                // Send to existing thread
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
            // Guest user flow
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex h-[calc(100vh-4rem)]">
                {/* Sidebar for logged users */}
                {isLoggedIn && (
                    <>
                        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                          fixed md:relative md:translate-x-0 z-30 w-72 bg-white border-r transition-transform duration-300 ease-in-out`}>
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h2 className="text-lg font-semibold">Riwayat Chat</h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={createNewThread}
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Chat Baru
                                        </button>
                                        <button
                                            onClick={() => setSidebarOpen(false)}
                                            className="md:hidden p-1.5 hover:bg-gray-100 rounded-md"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {threads.map((thread) => (
                                        <div
                                            key={thread.id}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors border ${activeThreadId === thread.id
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'hover:bg-gray-50 border-transparent'
                                                }`}
                                            onClick={() => {
                                                setActiveThreadId(thread.id);
                                                localStorage.setItem("lastActiveThreadId", thread.id);
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-sm truncate">{thread.title}</h3>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingThread(thread);
                                                            setEditTitle(thread.title || '');
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                    >
                                                        <Edit2 className="h-3 w-3 text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeletingThread(thread);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-1 hover:bg-red-100 rounded"
                                                    >
                                                        <Trash2 className="h-3 w-3 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(thread.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}

                                    {threads.length === 0 && (
                                        <p className="text-center text-gray-500 text-sm py-8">
                                            Belum ada riwayat chat. Mulai percakapan baru!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {sidebarOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}
                    </>
                )}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-white">
                        <div className="flex items-center gap-3">
                            {isLoggedIn && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-md"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                            )}
                            <h2 className="text-lg font-semibold">
                                {isLoggedIn ? (activeThreadId ? 'Chat Room' : 'Mulai Chat Baru') : 'Tanya Hukum AI'}
                            </h2>
                        </div>

                        {!canAsk && (
                            <div className="text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Batas pertanyaan tercapai
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {/* Welcome message for guests */}
                            {!isLoggedIn && getCurrentMessages().length === 0 && (
                                <div className="text-center py-8">
                                    <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Selamat datang di Tanya Hukum AI
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Anda memiliki 3 percobaan gratis. Login untuk mendapatkan 20 pertanyaan per hari.
                                    </p>
                                </div>
                            )}

                            {/* Welcome message for logged users */}
                            {isLoggedIn && getCurrentMessages().length === 0 && !activeThreadId && (
                                <div className="text-center py-8">
                                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Mulai percakapan baru
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Ajukan pertanyaan hukum Anda dan dapatkan jawaban dari AI.
                                    </p>
                                </div>
                            )}

                            {/* Messages */}
                            {getCurrentMessages().map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'} gap-3`}
                                >
                                    {message.sender === 'AI' && (
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-blue-600" />
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] ${message.sender === 'USER' ? 'order-1' : ''}`}>
                                        <div
                                            className={`px-4 py-3 rounded-2xl ${message.sender === 'USER'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-900 shadow-sm border'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.message}</p>
                                        </div>
                                        <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'USER' ? 'text-right' : ''
                                            }`}>
                                            {new Date(message.createdAt || message.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>

                                    {message.sender === 'USER' && (
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-green-600" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* AI typing animation */}
                            {isLoading && (
                                <div className="flex justify-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border">
                                        <div className="flex items-center gap-2">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                            <span className="text-sm text-gray-600">AI sedang berpikir...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t bg-white p-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !canAsk || !currentMessage.trim()}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Kirim
                                </button>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">
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
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Login untuk 20 pertanyaan/hari →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Batas Percobaan Tercapai</h3>
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                    <p className="text-sm text-orange-800">
                                        Anda telah menggunakan 3 pertanyaan gratis hari ini.
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">
                                Login untuk mendapatkan keuntungan:
                            </p>

                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    20 pertanyaan per hari
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Riwayat percakapan tersimpan
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Sistem room chat
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Login Sekarang
                            </button>
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Nanti Saja
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Thread Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Edit Judul Chat</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Judul Chat
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan judul chat..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Simpan
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Thread Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Hapus Percakapan?</h2>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-gray-600">
                                Apakah Anda yakin ingin menghapus percakapan "{deletingThread?.title}"?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteThread}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Hapus
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
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