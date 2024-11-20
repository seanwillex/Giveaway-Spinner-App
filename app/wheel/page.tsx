'use client';

import { useState, useEffect } from 'react';
import { PrizeWheel } from '@/components/prize-wheel';
import { PrizeManager } from '@/components/prize-wheel/prize-manager';
import { WinnersList } from '@/components/prize-wheel/winners-list';
import { Prize, Winner, Contestant } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function WheelPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load contestants from localStorage
    const storedContestants = localStorage.getItem('contestants');
    if (storedContestants) {
      setContestants(JSON.parse(storedContestants));
    }
  }, []);

  const handleWinner = (winner: Winner) => {
    setWinners(prev => [...prev, winner]);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <section className="w-full">
        <PrizeWheel 
          prizes={prizes} 
          contestants={contestants}
          onWinner={handleWinner}
          excludePreviousWinners={true}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Current Prizes</h2>
          <PrizeManager 
            prizes={prizes} 
            setPrizes={setPrizes} 
          />
        </div>
        
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Winners</h2>
          <WinnersList 
            winners={winners} 
            contestants={contestants} 
            prizes={prizes} 
          />
        </div>
      </section>
    </div>
  );
} 