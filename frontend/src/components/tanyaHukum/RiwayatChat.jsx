
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import  {ScrollArea}  from"../ui/scroll-area"
import { Badge } from "../ui/badge"

const RiwayatChat = () => {
    return (
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
                  {Array.isArray(questions) && questions.map((message) => (
                      <div
                        key={message.id || `${message.question}-${message.createdAt}`}
                        className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                      >
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
                            Referensi: {message.reference ?? "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
    )
}

export default RiwayatChat