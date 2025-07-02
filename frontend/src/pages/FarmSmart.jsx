// Tetap pakai React Query & useFarmSmartStore
import useFarmSmartStore from "@/store/farmStore";
import { useWeatherForecast, useCreateFarmAnalysis } from "@/hooks/farmSmart";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import WeatherTab from "@/components/farmSmart/Cuaca";
import AnalysisTab from "@/components/farmSmart/AnalisisTanaman";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

const FarmSmartPage = () => {
  const {
    location,
    date,
    question,
    addResult,
  } = useFarmSmartStore();

  const { data: weatherData, refetch, isLoading: loadingWeather } =
    useWeatherForecast(location);
  const { mutate: createAnalysis, data: aiResult, isLoading: loadingAI } =
    useCreateFarmAnalysis();

  const detectLocation = () => {
    setTimeout(() => {
      useFarmSmartStore.getState().setLocation("Gading Rejo");
      refetch();
    }, 500);
  };

  const handleSubmit = () => {
    createAnalysis({
      farmEntryId: `farm-${Date.now()}`,
      harvestDate: date,
      location,
      plant: useFarmSmartStore.getState().plant,
      question,
    });
  };

  const handleSaveResult = () => {
    if (!aiResult?.analysis) return;
    const { analysis } = aiResult;
    addResult({
      id: analysis.id,
      location,
      plant: useFarmSmartStore.getState().plant,
      plantingDate: format(date, "dd MMMM yyyy", { locale: id }),
      harvestDate: format(new Date(analysis.harvestDate), "dd MMMM yyyy", { locale: id }),
      steps: analysis.steps,
      risks: analysis.risks,
    });
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <Tabs defaultValue="weather" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="weather">Data Cuaca</TabsTrigger>
          <TabsTrigger value="analysis">Analisis Tanaman</TabsTrigger>
        </TabsList>

        <TabsContent value="weather">
          <WeatherTab
            weatherData={weatherData}
            isLoading={loadingWeather}
            detectLocation={detectLocation}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <AnalysisTab
            aiResult={aiResult}
            isLoading={loadingAI}
            detectLocation={detectLocation}
            handleSubmit={handleSubmit}
            handleSaveResult={handleSaveResult}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default FarmSmartPage;
