import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import useThemeStore from "@/store/theme";
import {useState} from "react";
import useHukumStore from "@/store/tanyahukum";

const RoomChat = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const { isDarkMode } = useThemeStore();
    const { sendMessage } = useHukumStore();

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            sendMessage(currentMessage);
            setCurrentMessage("");
        }
    };

    return (
                  <div className="flex">
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
                            onChange={(e) => setCurrentMessage(e.target.value)} />
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
                                            className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${chat.sender === 'user'
                                                ? `${isDarkMode ? 'bg-[#00FF85] text-black' : 'bg-blue-600 text-white'} rounded-tr-none`
                                                : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-tl-none`}`}
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
                                } } />
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
        </div><div className="flex-1 flex flex-col h-[calc(100vh-180px)]">
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
                                onChange={(e) => setCurrentMessage(e.target.value)} />
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
                                                className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${chat.sender === 'user'
                                                    ? `${isDarkMode ? 'bg-[#00FF85] text-black' : 'bg-blue-600 text-white'} rounded-tr-none`
                                                    : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-tl-none`}`}
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
                                    } } />
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
    )
}

export default RoomChat;