import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import useThemeStore from "@/store/theme";
import useHukumStore from "@/store/tanyahukum";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/tanyaHukum/Sidebar";
import FAQ  from "@/components/tanyaHukum/FAQ"
import RoomChat from "@/components/tanyaHukum/RoomChat";

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
  }, [fetchQuestions]); 

  const handleAskQuestion = async () => {
    const trimmedQuestion = currentQuestion.trim();
    if (!trimmedQuestion) return;
    await askQuestion(trimmedQuestion);
    setCurrentQuestion("");
  };

  return (
    <div className={`min-h-screen pt-20 pb-10 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header/>
      <Sidebar/>
<FAQ/>
<RoomChat/>
      <Footer/>
    </div>
  );
};

export default TanyaHukumPage;
