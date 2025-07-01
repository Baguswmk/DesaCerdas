import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useThemeStore from "../../store/theme";
import useHukumStore from "../../store/tanyahukum";
import { useState } from "react";
const Sidebar = () => {
    const { isDarkMode } = useThemeStore();
    const { chatHistory, deleteChatSession, updateChatTitle } = useHukumStore
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingTitle, setEditingTitle] = useState("");
    const handleEditTitle = (sessionId, title) => {
        setCurrentSessionId(sessionId);
        setEditingTitle(title);
        setShowEditDialog(true);
    };
    const saveEditedTitle = () => {
        if (editingTitle.trim() === "") {
            alert("Judul tidak boleh kosong");
            return;
        }
        updateChatTitle(currentSessionId, editingTitle);
        setShowEditDialog(false);
    };
    const handleDeleteSession = (sessionId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
            deleteChatSession(sessionId);
            if (currentSessionId === sessionId) {
                setCurrentSessionId(null);
            }
        }
    };

    return (
        <div className={`w-64 border-r ${isDarkMode ? 'border-gray-700 bg-[#232D42]' : 'border-gray-200 bg-gray-50'} h-[calc(100vh-180px)] flex flex-col`}>
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Riwayat Chat</h3>
            </div>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className={`${isDarkMode ? 'bg-[#232D42] text-white' : 'bg-white'} border-none shadow-lg`}>
                    <DialogHeader>
                        <DialogTitle>Edit Judul Chat</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className={`${isDarkMode ? 'bg-[#1A2332] border-gray-700' : 'bg-white border-gray-200'}`}
                    />
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowEditDialog(false)}
                            className="!rounded-button whitespace-nowrap cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={saveEditedTitle}
                            className={`${isDarkMode ? 'bg-[#00FF85] text-black hover:bg-[#00CC6A]' : 'bg-blue-600 text-white hover:bg-blue-700'} !rounded-button whitespace-nowrap cursor-pointer`}
                        >
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                    {[...new Set(chatHistory.map(chat => chat.sessionId))].map((sessionId, index) => {
                        const firstMessage = chatHistory.find(chat => chat.sessionId === sessionId);
                        return (
                            <div
                                key={sessionId}
                                id={`chat-session-${sessionId}`}
                                className={`p-3 rounded-lg cursor-pointer ${currentSessionId === sessionId
                                    ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                                    : ''
                                    } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div
                                        className="flex-1 overflow-hidden"
                                        onClick={() => setCurrentSessionId(sessionId)}
                                    >
                                        <p className="text-sm font-medium truncate">
                                            <i className={`fas fa-comments mr-2 ${currentSessionId === sessionId ? 'text-[#00FF85]' : ''}`}></i>
                                            {firstMessage?.title || firstMessage?.message.substring(0, 30)}...
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditTitle(sessionId, firstMessage?.title || firstMessage?.message.substring(0, 30));
                                            }}
                                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSession(sessionId);
                                            }}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}

export default Sidebar