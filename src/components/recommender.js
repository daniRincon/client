import React, { useState } from 'react';
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Modal } from "../components/ui/modal"

const VIEWS = {
  SHOW_GENERATE_RECOMMENDATIONS: "SHOW_GENERATE_RECOMMENDATIONS",
  SHOW_LOADING_RECOMMENDATIONS: "SHOW_LOADING_RECOMMENDATIONS"
}

export default function Recommender({ onData }) {
  const [view, setView] = useState(VIEWS.SHOW_GENERATE_RECOMMENDATIONS);
  const [recommendations, setRecommendations] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRecommendations = async () => {
    setView(VIEWS.SHOW_LOADING_RECOMMENDATIONS);
    try {
      const heart_rate = onData();
      if (heart_rate.length === 0) {
        throw new Error('No ECG data available');
      }
      const response = await fetch('http://localhost:5000/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heart_rate: heart_rate.toString() }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRecommendations(data.recommendation);
      setIsModalOpen(true);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setRecommendations('Unable to generate recommendations at this time. Please try again later.');
      setIsModalOpen(true);
    } finally {
      setView(VIEWS.SHOW_GENERATE_RECOMMENDATIONS);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Recomendaciones IA</CardTitle>
          <CardDescription>Obtén recomendaciones basadas en tu ECG</CardDescription>
        </CardHeader>
        <CardContent>
          {view === VIEWS.SHOW_GENERATE_RECOMMENDATIONS && (
            <div className="flex flex-col items-center space-y-4">
              <img src="/robot2.png?height=100&width=100" alt="AI Assistant" className="rounded-full" />
              <Button onClick={getRecommendations} className="w-full">
                Obtener recomendación
              </Button>
            </div>
          )}
          {view === VIEWS.SHOW_LOADING_RECOMMENDATIONS && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-sm text-gray-500">Generando recomendación...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Recomendación:</h3>
        <p className="text-sm mb-4">{recommendations}</p>
      </Modal>
    </>
  );
}