'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Prize } from "@/types";

interface PrizeManagerProps {
  prizes: Prize[];
  setPrizes: (prizes: Prize[]) => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
];

export function PrizeManager({ prizes, setPrizes }: PrizeManagerProps) {
  const [newPrize, setNewPrize] = useState<string>('');
  const [probability, setProbability] = useState<number>(1);

  const handleAddPrize = () => {
    if (!newPrize.trim()) return;

    const newPrizeItem: Prize = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPrize.trim(),
      probability: probability,
      color: COLORS[prizes.length % COLORS.length],
    };

    setPrizes([...prizes, newPrizeItem]);
    setNewPrize('');
    setProbability(1); // Reset probability
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          type="text"
          value={newPrize}
          onChange={(e) => setNewPrize(e.target.value)}
          placeholder="Enter prize name"
          className="w-full"
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Probability Rate (1-10)
          </label>
          <Input
            type="number"
            value={probability}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= 10) {
                setProbability(value);
              }
            }}
            min={1}
            max={10}
            className="w-full"
          />
        </div>

        <Button onClick={handleAddPrize} className="w-full">
          Add Prize
        </Button>
      </div>

      <div className="space-y-2">
        {prizes.map((prize) => (
          <div 
            key={prize.id} 
            className="flex justify-between items-center p-2 border rounded" 
            style={{ backgroundColor: `${prize.color}20` }}
          >
            <div className="flex flex-col">
              <span className="font-medium">{prize.name}</span>
              <span className="text-sm text-muted-foreground">
                Probability: {prize.probability}x
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setPrizes(prizes.filter(p => p.id !== prize.id))}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 