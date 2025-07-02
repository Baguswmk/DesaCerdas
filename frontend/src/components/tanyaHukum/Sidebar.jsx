import { useEffect, useState } from "react";
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

  const { sidebarOpen, toggleSidebar } = useChatUIStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingThread, setEditingThread] = useState(null);
  const [deletingThread, setDeletingThread] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const { activeThreadId, setActiveThreadId } = useChatUIStore();
  const deleteThread = useDeleteThread();
  const updateThreadTitle = useUpdateThreadTitle();
  const createThread = useCreateThread();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Ambil dari localStorage saat threads ready
  useEffect(() => {
    if (threads.length > 0 && !activeThreadId) {
      const lastId = localStorage.getItem("lastActiveThreadId");
      const found = threads.find((t) => t.id === lastId);
      if (found) {
        setActiveThreadId(found.id);
      } else {
        // fallback ke thread terbaru
        setActiveThreadId(threads[0].id);
        localStorage.setItem("lastActiveThreadId", threads[0].id);
      }
    }
  }, [threads, activeThreadId, setActiveThreadId]);

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
        id: editingThread.id,
        title: editTitle.trim(),
      });
      setIsEditModalOpen(false);
      setEditingThread(null);
    }
  };

  const handleDelete = async () => {
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



  if (!isLoggedIn) {
    return (
      <aside className="w-[280px] border-r border-gray-200 bg-gray-50 h-[calc(100vh-64px)] sticky top-16 p-4 text-center text-sm text-gray-500 dark:text-gray-300">
        <p>Silakan login untuk melihat riwayat chat hukum Anda.</p>
      </aside>
    );
  }

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed md:relative md:translate-x-0 z-40 w-72 h-[calc(100vh-4rem)] border-r bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Room Chat</h2>
          <div className="flex items-center gap-2">
            <Button
                onClick={() => {
              createThread.mutate("Chat Baru", {
                onSuccess: (newThread) => {
                  setActiveThreadId(newThread.id);
                },
              });
            }}
              className="bg-green-600 hover:bg-green-700 text-white !rounded-button whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-plus mr-2"></i>
              Chat Baru
            </Button>
            {windowWidth < 768 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden !rounded-button cursor-pointer"
              >
                <i className="fas fa-times text-xl"></i>
              </Button>
            )}
          </div>
        </div>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            User: {user?.name || "Tidak dikenal"}
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  thread.id === activeThreadId
                    ? "border-green-600 bg-green-50 dark:bg-green-950"
                    : ""
                }`}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  localStorage.setItem("lastActiveThreadId", thread.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-comments text-green-600"></i>
                    <span className="font-medium">
                      {thread.title || "Tanpa Judul"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 !rounded-button cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(thread);
                      }}
                    >
                      <i className="fas fa-edit text-gray-500 hover:text-gray-700"></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 !rounded-button cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(thread);
                      }}
                    >
                      <i className="fas fa-trash text-gray-500 hover:text-gray-700"></i>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(thread.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Judul Chat</DialogTitle>
            <DialogDescription>
              Ubah nama sesi percakapan ini.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button  className="cursor-pointer"onClick={handleSaveEdit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Hapus Percakapan?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus chat ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button className="cursor-pointer" variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Sidebar;
