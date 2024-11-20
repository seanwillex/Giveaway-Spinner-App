'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Prize, Winner, Contestant } from '@/types';
import confetti from 'canvas-confetti';

interface PrizeWheelProps {
  prizes: Prize[];
  contestants: Contestant[];
  onWinner: (winner: Winner) => void;
  excludePreviousWinners?: boolean;
}

export function PrizeWheel({
  prizes,
  contestants,
  onWinner,
  excludePreviousWinners = false,
}: PrizeWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!isSpinning && wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  }, [isSpinning]);

  const spinWheel = () => {
    if (!wheelRef.current || isSpinning || !prizes.length || !contestants.length) return;

    setIsSpinning(true);

    // Calculate rotation
    const extraSpins = 5; // Number of full rotations before stopping
    const baseRotation = 360 * extraSpins;
    const randomRotation = Math.random() * 360;
    const totalRotation = baseRotation + randomRotation;

    // Apply rotation
    wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.4, 2, 0.2, 1)';
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

    // Calculate winner
    setTimeout(() => {
      const normalizedRotation = randomRotation;
      const segmentAngle = 360 / prizes.length;
      const winningIndex = Math.floor(normalizedRotation / segmentAngle);
      const actualIndex = prizes.length - 1 - winningIndex;
      const winner = {
        prize: prizes[actualIndex],
        contestant: contestants[Math.floor(Math.random() * contestants.length)],
      };

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onWinner(winner);
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div className="relative aspect-square max-w-xl mx-auto">
      <div className="absolute inset-0 rounded-full border-4 border-gray-200 overflow-hidden bg-white shadow-lg">
        <div
          ref={wheelRef}
          className="absolute inset-0 transition-transform duration-[6000ms] ease-out"
          style={{ transformOrigin: 'center' }}
        >
          {prizes.map((prize, index) => {
            const segmentAngle = 360 / prizes.length;
            const rotation = segmentAngle * index;
            
            return (
              <div
                key={prize.id}
                className="absolute inset-0"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {/* Colored segment */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0, ${50 + segmentAngle}% 0)`,
                    backgroundColor: prize.color,
                  }}
                />
                
                {/* Text label */}
                <div
                  className="absolute whitespace-nowrap text-white font-bold text-lg"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'left',
                    transform: `rotate(${rotation + segmentAngle / 2}deg)`,
                  }}
                >
                  {prize.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning || !prizes.length || !contestants.length}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 
                  w-16 h-16 rounded-full bg-black text-white hover:bg-gray-800"
      >
        {isSpinning ? '...' : 'Spin!'}
      </Button>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
        <div className="w-4 h-4 bg-black transform rotate-45 mx-auto mt-6"></div>
      </div>
    </div>
  );
} 