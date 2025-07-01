// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
const App: React.FC = () => {
const [isDarkMode, setIsDarkMode] = useState(true);
const [currentMessage, setCurrentMessage] = useState('');
const [currentSessionId, setCurrentSessionId] = useState<string>(new Date().getTime().toString());
const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
const [chatHistory, setChatHistory] = useState<{
id: number;
sessionId: string;
sender: 'user' | 'ai';
message: string;
timestamp: string;
references?: string[];
}[]>([
{
id: 1,
sessionId: currentSessionId,
sender: 'user',
message: 'Bagaimana prosedur untuk mendaftarkan merek dagang di Indonesia?',
timestamp: '10:30'
},
{
id: 2,
sessionId: currentSessionId,
sender: 'ai',
message: 'Untuk mendaftarkan merek dagang di Indonesia, Anda perlu mengikuti prosedur berikut:\n\n1. Melakukan pemeriksaan ketersediaan merek\n2. Mengisi formulir pendaftaran merek\n3. Membayar biaya pendaftaran\n4. Menunggu proses pemeriksaan substantif\n5. Menerima sertifikat merek jika disetujui',
timestamp: '10:31',
references: ['UU No. 20 Tahun 2016 tentang Merek dan Indikasi Geografis', 'Peraturan Menteri Hukum dan HAM No. 67 Tahun 2016']
},
{
id: 3,
sessionId: currentSessionId,
sender: 'user',
message: 'Berapa lama proses pendaftaran merek dagang?',
timestamp: '10:32'
},
{
id: 4,
sessionId: currentSessionId,
sender: 'ai',
message: 'Proses pendaftaran merek dagang di Indonesia membutuhkan waktu sekitar 12-18 bulan sejak tanggal pengajuan hingga mendapatkan sertifikat. Tahapan waktunya meliputi:\n\n- Pemeriksaan administratif: 1 bulan\n- Pengumuman: 2 bulan\n- Pemeriksaan substantif: 6-9 bulan\n- Penerbitan sertifikat: 1-2 bulan',
timestamp: '10:33',
references: ['UU No. 20 Tahun 2016 Pasal 23-27', 'Peraturan Menteri Hukum dan HAM No. 67 Tahun 2016 Pasal 15']
}
]);
const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
const [editingTitle, setEditingTitle] = useState('');
const [showEditDialog, setShowEditDialog] = useState(false);

const handleSendMessage = () => {
if (currentMessage.trim()) {
const newMessage = {
id: chatHistory.length + 1,
sessionId: new Date().getTime().toString(),
sender: 'user' as const,
message: currentMessage,
timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
title: currentMessage.substring(0, 30)
};
setChatHistory([...chatHistory, newMessage]);
setCurrentMessage('');
setCurrentSessionId(newMessage.sessionId);

// Simulate AI response
setTimeout(() => {
const aiResponse = {
id: chatHistory.length + 2,
sessionId: newMessage.sessionId,
sender: 'ai' as const,
message: 'Terima kasih atas pertanyaan Anda. Saya sedang memproses jawaban berdasarkan referensi hukum yang relevan.',
timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
references: ['UU No. 20 Tahun 2016', 'Peraturan Menteri Hukum dan HAM No. 67 Tahun 2016']
};
setChatHistory(prev => [...prev, aiResponse]);
}, 1000);
}
};

const handleEditTitle = (sessionId: string, currentTitle: string) => {
setEditingSessionId(sessionId);
setEditingTitle(currentTitle);
setShowEditDialog(true);
};

const handleDeleteSession = (sessionId: string) => {
setChatHistory(prev => prev.filter(chat => chat.sessionId !== sessionId));
if (currentSessionId === sessionId) {
const lastSession = chatHistory.filter(chat => chat.sessionId !== sessionId)[0];
setCurrentSessionId(lastSession?.sessionId || '');
}
};

const saveEditedTitle = () => {
setChatHistory(prev => prev.map(chat => 
chat.sessionId === editingSessionId && chat.sender === 'user'
? { ...chat, title: editingTitle }
: chat
));
setShowEditDialog(false);
setEditingSessionId(null);
setEditingTitle('');
};
const toggleTheme = () => {
setIsDarkMode(!isDarkMode);
};
return (
<div className={`min-h-screen ${isDarkMode ? 'bg-[#1A2332] text-white' : 'bg-white text-gray-900'}`}>
<div className="container mx-auto px-4 py-6">
{/* Header */}
<header className="flex justify-between items-center mb-8">
<div>
<h1 className="text-3xl font-bold">TanyaHukum</h1>
<p className="text-sm mt-1 opacity-80">Konsultasi hukum gratis dengan AI yang dilengkapi referensi undang-undang</p>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center space-x-2">
<Switch
id="theme-mode"
checked={!isDarkMode}
onCheckedChange={toggleTheme}
className="!rounded-button"
/>
<Label htmlFor="theme-mode" className="cursor-pointer">
{isDarkMode ? (
<i className="fas fa-sun"></i>
) : (
<i className="fas fa-moon"></i>
)}
</Label>
</div>
<Button variant={isDarkMode ? "outline" : "default"} className="!rounded-button whitespace-nowrap cursor-pointer">Login</Button>
<Button className={`${isDarkMode ? 'bg-[#00FF85] text-black hover:bg-[#00CC6A]' : 'bg-blue-600 text-white hover:bg-blue-700'} !rounded-button whitespace-nowrap cursor-pointer`}>Register</Button>
</div>
</header>
{/* Navigation */}
<nav className="flex justify-between items-center mb-8">
<div className="flex items-center gap-2">
<i className="fas fa-home text-[#00FF85]"></i>
<span className="font-medium">DesaCerdas Platform</span>
</div>
<div className="flex items-center gap-6">
<a href="#" className={`${isDarkMode ? 'text-white' : 'text-gray-700'} hover:text-[#00FF85] cursor-pointer`}>Beranda</a>
<a href="#" className={`${isDarkMode ? 'text-white' : 'text-gray-700'} hover:text-[#00FF85] cursor-pointer`}>Tentang Kami</a>
<a href="#" className={`${isDarkMode ? 'text-white' : 'text-gray-700'} hover:text-[#00FF85] cursor-pointer`}>Kontak</a>
<div className="relative group">
<a href="#" className={`${isDarkMode ? 'text-white' : 'text-gray-700'} hover:text-[#00FF85] cursor-pointer flex items-center gap-1`}>
Fitur <i className="fas fa-chevron-down text-xs"></i>
</a>
</div>
</div>
</nav>
{/* Main Content */}
<div className="flex">
{/* Sidebar - Chat History */}
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
className={`p-3 rounded-lg cursor-pointer ${
currentSessionId === sessionId
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
{/* Main Chat Area */}
<div className="flex-1 flex flex-col h-[calc(100vh-180px)]">
<Card className={`flex-1 ${isDarkMode ? 'bg-[#232D42] bg-opacity-70' : 'bg-gray-50'} border-none shadow-lg overflow-hidden`}>
<div className="flex items-center gap-2 mb-4">
<h2 className="text-xl font-semibold">Ajukan Pertanyaan Baru</h2>
<div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
<i className="fas fa-circle text-[#00FF85] text-xs mr-1"></i> AI Aktif
</div>
</div>
<Tabs defaultValue="chat" className="w-full">
<TabsList className={`grid w-full grid-cols-2 mb-4 ${isDarkMode ? 'bg-[#1A2332]' : 'bg-gray-100'}`}>
<TabsTrigger value="chat" className="!rounded-button whitespace-nowrap">Chat</TabsTrigger>
<TabsTrigger value="document" className="!rounded-button whitespace-nowrap">Unggah Dokumen</TabsTrigger>
</TabsList>
<TabsContent value="chat">
<Textarea
placeholder="Masukkan pertanyaan hukum Anda di sini... Contoh: Bagaimana prosedur pengurusan sertifikat tanah?"
className={`min-h-[200px] mb-4 ${isDarkMode ? 'bg-[#1A2332] border-gray-700' : 'bg-white border-gray-200'}`}
value={currentMessage}
onChange={(e) => setCurrentMessage(e.target.value)}
/>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-paperclip mr-2"></i> Lampirkan File
</Button>
</div>
<Button
onClick={handleSendMessage}
className={`${isDarkMode ? 'bg-[#00FF85] text-black hover:bg-[#00CC6A]' : 'bg-blue-600 text-white hover:bg-blue-700'} !rounded-button whitespace-nowrap cursor-pointer`}
>
<i className="fas fa-paper-plane mr-2"></i> Tanyakan ke AI
</Button>
</div>
</TabsContent>
<TabsContent value="document">
<div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg p-8 text-center mb-4`}>
<i className="fas fa-file-upload text-4xl mb-3 text-gray-400"></i>
<p className="mb-2">Seret dan lepas dokumen hukum Anda di sini</p>
<p className="text-sm text-gray-500 mb-4">atau</p>
<Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
Pilih File
</Button>
<p className="text-xs mt-3 text-gray-500">Format yang didukung: PDF, DOCX, JPG (Maks. 10MB)</p>
</div>
<Button
className={`w-full ${isDarkMode ? 'bg-[#00FF85] text-black hover:bg-[#00CC6A]' : 'bg-blue-600 text-white hover:bg-blue-700'} !rounded-button whitespace-nowrap cursor-pointer`}
>
<i className="fas fa-search mr-2"></i> Analisis Dokumen
</Button>
</TabsContent>
</Tabs>
</Card>
{/* Right Column - Chat History */}
<Card className={`p-6 ${isDarkMode ? 'bg-[#232D42] bg-opacity-70' : 'bg-gray-50'} border-none shadow-lg`}>
<h2 className="text-xl font-semibold mb-4">Riwayat Pertanyaan</h2>
<div className="flex flex-col h-[400px]">
<ScrollArea className={`flex-1 pr-4 ${isDarkMode ? 'bg-[#1A2332] rounded-lg p-4' : 'bg-white rounded-lg p-4 border border-gray-100'}`}>
{chatHistory.filter(chat => chat.sessionId === currentSessionId).map((chat) => (
<div key={chat.id} className={`mb-4 ${chat.sender === 'user' ? 'text-right' : 'text-left'}`}>
<div className="flex items-start gap-3 mb-1">
{chat.sender === 'ai' && (
<Avatar className="h-8 w-8">
<AvatarImage src="https://readdy.ai/api/search-image?query=modern%20minimalist%20AI%20assistant%20logo%20with%20blue%20gradient%20and%20simple%20geometric%20shapes%2C%20professional%2C%20clean%20design%2C%20technology%20concept&width=100&height=100&seq=1&orientation=squarish" />
<AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
</Avatar>
)}
<div className={`flex-1 ${chat.sender === 'user' ? 'order-first' : ''}`}>
<div
className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
chat.sender === 'user'
? `${isDarkMode ? 'bg-[#00FF85] text-black' : 'bg-blue-600 text-white'} rounded-tr-none`
: `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-tl-none`
}`}
>
<p className="whitespace-pre-line">{chat.message}</p>
{chat.references && (
<div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
<p className="font-semibold">Referensi:</p>
<ul className="list-disc pl-4">
{chat.references.map((ref, index) => (
<li key={index}>{ref}</li>
))}
</ul>
</div>
)}
</div>
<div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
{chat.timestamp}
</div>
</div>
{chat.sender === 'user' && (
<Avatar className="h-8 w-8">
<AvatarImage src="https://readdy.ai/api/search-image?query=modern%20minimalist%20user%20avatar%20silhouette%20with%20blue%20gradient%20background%2C%20professional%2C%20clean%20design&width=100&height=100&seq=2&orientation=squarish" />
<AvatarFallback className="bg-gray-600 text-white">U</AvatarFallback>
</Avatar>
)}
</div>
</div>
))}
</ScrollArea>
<div className={`mt-4 p-4 ${isDarkMode ? 'bg-[#1A2332]' : 'bg-white'} rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
<div className="flex gap-2">
<Input
value={currentMessage}
onChange={(e) => setCurrentMessage(e.target.value)}
placeholder="Ketik pertanyaan Anda..."
className={`flex-1 ${isDarkMode ? 'bg-[#232D42] border-gray-700' : 'bg-white border-gray-200'}`}
onKeyPress={(e) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
handleSendMessage();
}
}}
/>
<Button
onClick={handleSendMessage}
className={`${isDarkMode ? 'bg-[#00FF85] text-black hover:bg-[#00CC6A]' : 'bg-blue-600 text-white hover:bg-blue-700'} !rounded-button whitespace-nowrap cursor-pointer`}
>
<i className="fas fa-paper-plane"></i>
</Button>
</div>
</div>
</div>
</Card>
</div>
</div>
{/* Features Section */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
<Card className={`p-6 ${isDarkMode ? 'bg-[#232D42] bg-opacity-70' : 'bg-white'} border-none shadow-lg`}>
<div className="flex items-center gap-4 mb-4">
<div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#1A2332]' : 'bg-blue-100'}`}>
<i className={`fas fa-balance-scale text-xl ${isDarkMode ? 'text-[#00FF85]' : 'text-blue-600'}`}></i>
</div>
<h3 className="text-lg font-semibold">Konsultasi Hukum Cepat</h3>
</div>
<p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
Dapatkan jawaban instan untuk pertanyaan hukum Anda dengan dukungan AI yang memahami konteks hukum Indonesia.
</p>
</Card>
<Card className={`p-6 ${isDarkMode ? 'bg-[#232D42] bg-opacity-70' : 'bg-white'} border-none shadow-lg`}>
<div className="flex items-center gap-4 mb-4">
<div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#1A2332]' : 'bg-blue-100'}`}>
<i className={`fas fa-book-open text-xl ${isDarkMode ? 'text-[#00FF85]' : 'text-blue-600'}`}></i>
</div>
<h3 className="text-lg font-semibold">Referensi Undang-Undang</h3>
</div>
<p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
Setiap jawaban dilengkapi dengan referensi undang-undang dan peraturan terkait yang valid dan terbaru.
</p>
</Card>
<Card className={`p-6 ${isDarkMode ? 'bg-[#232D42] bg-opacity-70' : 'bg-white'} border-none shadow-lg`}>
<div className="flex items-center gap-4 mb-4">
<div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#1A2332]' : 'bg-blue-100'}`}>
<i className={`fas fa-file-alt text-xl ${isDarkMode ? 'text-[#00FF85]' : 'text-blue-600'}`}></i>
</div>
<h3 className="text-lg font-semibold">Analisis Dokumen Hukum</h3>
</div>
<p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
Unggah dokumen hukum Anda untuk mendapatkan analisis dan penjelasan dalam bahasa yang mudah dipahami.
</p>
</Card>
</div>
{/* FAQ and References Section - Moved below Features */}
<div className={`mt-8 ${isDarkMode ? 'bg-[#232D42] bg-opacity-70' : 'bg-gray-50'} rounded-lg p-6 shadow-lg`}>
<h2 className="text-xl font-semibold mb-4">Referensi & FAQ Hukum</h2>
<Tabs defaultValue="faq">
<TabsList className="mb-4">
<TabsTrigger value="faq" className="!rounded-button whitespace-nowrap cursor-pointer">FAQ</TabsTrigger>
<TabsTrigger value="references" className="!rounded-button whitespace-nowrap cursor-pointer">Referensi UU</TabsTrigger>
</TabsList>
<TabsContent value="faq">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{[
{
q: "Apa perbedaan antara PT dan CV?",
a: "PT (Perseroan Terbatas) adalah badan hukum yang kepemilikannya terbagi atas saham, sedangkan CV (Commanditaire Vennootschap) adalah persekutuan yang terdiri dari satu atau lebih sekutu komanditer."
},
{
q: "Bagaimana cara mendaftarkan hak cipta?",
a: "Pendaftaran hak cipta dapat dilakukan melalui DJKI (Direktorat Jenderal Kekayaan Intelektual) dengan mengisi formulir, membayar biaya, dan melampirkan dokumen yang diperlukan."
},
{
q: "Berapa lama proses pengurusan IMB?",
a: "Proses pengurusan IMB umumnya memakan waktu 14-30 hari kerja, tergantung pada kompleksitas bangunan dan kelengkapan dokumen yang diajukan."
}
].map((item, index) => (
<Card key={index} className={`p-4 ${isDarkMode ? 'bg-[#1A2332]' : 'bg-white'}`}>
<h3 className="font-medium mb-2">{item.q}</h3>
<p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.a}</p>
</Card>
))}
</div>
</TabsContent>
<TabsContent value="references">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{[
{
title: "UU No. 40 Tahun 2007",
desc: "Tentang Perseroan Terbatas",
link: "#"
},
{
title: "UU No. 28 Tahun 2014",
desc: "Tentang Hak Cipta",
link: "#"
},
{
title: "UU No. 11 Tahun 2020",
desc: "Tentang Cipta Kerja",
link: "#"
}
].map((item, index) => (
<Card key={index} className={`p-4 ${isDarkMode ? 'bg-[#1A2332]' : 'bg-white'}`}>
<div className="flex justify-between items-center">
<div>
<h3 className="font-medium">{item.title}</h3>
<p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.desc}</p>
</div>
<Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-external-link-alt"></i>
</Button>
</div>
</Card>
))}
</div>
</TabsContent>
</Tabs>
</div>
{/* Footer */}
<footer className="mt-16 pt-8 border-t border-gray-700">
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
<div>
<div className="flex items-center gap-2 mb-4">
<i className="fas fa-home text-[#00FF85]"></i>
<span className="font-bold text-xl">DesaCerdas</span>
</div>
<p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
Platform digital untuk memberdayakan masyarakat desa Indonesia
</p>
</div>
<div>
<h3 className="font-semibold mb-4">Fitur</h3>
<ul className="space-y-2">
<li><a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer`}>TanyaHukum</a></li>
<li><a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer`}>FarmSmart</a></li>
<li><a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer`}>BantuDesa</a></li>
</ul>
</div>
<div>
<h3 className="font-semibold mb-4">Perusahaan</h3>
<ul className="space-y-2">
<li><a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer`}>Tentang Kami</a></li>
<li><a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer`}>Kontak</a></li>
<li><a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer`}>Karir</a></li>
</ul>
</div>
<div>
<h3 className="font-semibold mb-4">Ikuti Kami</h3>
<div className="flex gap-4">
<a href="#" className="text-xl cursor-pointer"><i className="fab fa-facebook"></i></a>
<a href="#" className="text-xl cursor-pointer"><i className="fab fa-twitter"></i></a>
<a href="#" className="text-xl cursor-pointer"><i className="fab fa-instagram"></i></a>
<a href="#" className="text-xl cursor-pointer"><i className="fab fa-youtube"></i></a>
</div>
</div>
</div>
<div className="mt-8 pt-6 border-t border-gray-700 text-center">
<p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
© 2025 DesaCerdas Platform. Semua hak dilindungi.
</p>
</div>
</footer>
</div>
</div>
);
};
export default App