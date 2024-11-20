'use client';

import { Prize, Winner, Contestant } from '@/types';

interface WinnersListProps {
  winners: Winner[];
  contestants: Contestant[];
  prizes: Prize[];
}

export function WinnersList({ 
  winners = [], 
  contestants = [], 
  prizes = [] 
}: WinnersListProps) {
  if (!contestants || !winners || !prizes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-semibold mb-4">Winners</h2>
      {winners.length === 0 ? (
        <p className="text-muted-foreground">No winners yet</p>
      ) : (
        <ul className="space-y-2">
          {winners.map((winner, index) => {
            const contestant = contestants.find(c => c.id === winner.contestantId);
            const prize = prizes.find(p => p.id === winner.prizeId);
            
            return (
              <li key={index} className="flex justify-between items-center">
                <span>{contestant?.name ?? 'Unknown Contestant'}</span>
                <span className="text-muted-foreground">{prize?.name ?? 'Unknown Prize'}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
} 