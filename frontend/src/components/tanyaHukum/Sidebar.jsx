import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import useChatUIStore from "@/store/chatUIStore";
import { useThreads } from "@/hooks/tanyaHukum/useThreads";
import { useDeleteThread } from "@/hooks/tanyaHukum/useDeleteThread";
import { useCreateThread } from "@/hooks/tanyaHukum/useCreateThread";
import { useUpdateThreadTitle } from "@/hooks/tanyaHukum/useUpdateThreadTitle";

const Sidebar = () => {
  const { isDarkMode } = useThemeStore();
  const { isLoggedIn, user } = useAuthStore();
  const { data: threads = [] } = useThreads();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingThread, setEditingThread] = useState(null);
  const [deletingThread, setDeletingThread] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const { activeThreadId, setActiveThreadId } = useChatUIStore();
  const deleteThread = useDeleteThread();
  const updateThreadTitle = useUpdateThreadTitle();
  const createThread = useCreateThread();
  const openEditModal = (thread) => {
    setEditingThread(thread);
    setEditTitle(thread.title || "");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (thread) => {
    setDeletingThread(thread);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingThread && editTitle.trim()) {
      await updateThreadTitle.mutateAsync({
        threadId: editingThread.id,
        title: editTitle.trim(),
      });
      setIsEditModalOpen(false);
      setEditingThread(null);
    }
  };

  const handleDelete = async () => {
    if (deletingThread) {
      await deleteThread.mutateAsync(deletingThread.id);
      setIsDeleteModalOpen(false);
      setDeletingThread(null);
      if (activeThreadId === deletingThread.id) {
        setActiveThreadId(null);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <aside className="w-[280px] border-r border-gray-200 bg-gray-50 h-[calc(100vh-64px)] sticky top-16 p-4 text-center text-sm text-gray-500 dark:text-gray-300">
        <p>Silakan login untuk melihat riwayat chat hukum Anda.</p>
      </aside>
    );
  }

  return (
    <aside
      className={`w-[280px] border-r h-[calc(100vh-64px)] sticky top-16 ${
        isDarkMode
          ? "bg-[#232D42] border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Room Chat
          </h2>
          <Button
            onClick={() => {
              createThread.mutate("Chat Baru", {
                onSuccess: (newThread) => {
                  setActiveThreadId(newThread.id);
                },
              });
            }}
            className="bg-green-600 hover:bg-green-700 text-white ..."
          >
            <i className="fas fa-plus mr-2"></i>
            Chat Baru
          </Button>
        </div>
        <p className="text-sm text-gray-500 mb-4 truncate">
          User: {user?.name || user?.email}
        </p>
        <Separator className="mb-4" />

        <ScrollArea className="h-[calc(100vh-200px)] pr-2">
          <div className="space-y-3">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`p-3 rounded-lg flex items-start justify-between transition-all ${
                  activeThreadId === thread.id
                    ? "bg-green-50 border-2 border-green-600"
                    : "bg-white hover:bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setActiveThreadId(thread.id)}
                >
                  <div className="flex items-start gap-3">
                    <i className="fas fa-comments text-green-600 mt-1"></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {thread.title || "Chat tanpa judul"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(thread);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 !rounded-button"
                  >
                    <i className="fas fa-edit text-gray-500 hover:text-green-600"></i>
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(thread);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 !rounded-button"
                  >
                    <i className="fas fa-trash text-gray-500 hover:text-red-600"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Modal Edit */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Judul Chat</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Masukkan judul baru"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleSaveEdit}
                disabled={updateThreadTitle.isLoading} 
                className={`${
                  isDarkMode
                    ? "bg-[#00FF85] text-black hover:bg-[#00CC6A]"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } !rounded-button whitespace-nowrap`}
              >
                {updateThreadTitle.isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Delete */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Hapus Chat</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus chat "{deletingThread?.title}
                "? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={handleDelete} className="bg-red-600 text-white">
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
};

export default Sidebar;
