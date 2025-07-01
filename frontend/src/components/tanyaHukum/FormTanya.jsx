import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

const FormTanya = () =>  {
  return(

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
  )

}