import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import useThemeStore from "@/store/theme";
import useHukumStore from "@/store/tanyahukum";

const TanyaHukumPage = () => {
  const { isDarkMode } = useThemeStore();
  const [currentQuestion, setCurrentQuestion] = useState("");

  const {
    questions,
    isLoading,
    fetchQuestions,
    askQuestion,
    error,
  } = useHukumStore();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim()) return;
    await askQuestion(currentQuestion.trim());
    setCurrentQuestion("");
  };

  return (
    <div className={`min-h-screen pt-20 pb-10 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            TanyaHukum
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Konsultasi hukum gratis dengan AI yang dilengkapi referensi undang-undang
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Tanya */}
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Ajukan Pertanyaan Baru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Masukkan pertanyaan hukum Anda di sini..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                className="min-h-32 text-sm"
              />
              <Button
                onClick={handleAskQuestion}
                disabled={isLoading || !currentQuestion.trim()}
                className="w-full !rounded-button whitespace-nowrap cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Tanyakan ke AI
                  </>
                )}
              </Button>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Riwayat Chat */}
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Riwayat Pertanyaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {questions.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Belum ada pertanyaan. Mulai ajukan pertanyaan pertama Anda!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {questions.map((message) => (
                      <div key={message.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs">
                            {new Date(message.createdAt).toLocaleString()}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <p className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Pertanyaan:
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {message.question}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className={`font-medium mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            Jawaban AI:
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {message.answer}
                          </p>
                        </div>
                        <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-blue-50'}`}>
                          <p className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Referensi: {message.reference}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TanyaHukumPage;
