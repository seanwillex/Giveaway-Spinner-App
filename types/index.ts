export interface Contestant {
  id: string;
  name: string;
  state: string;
  number: number;
  createdAt: Date;
}

export interface Prize {
  id: string;
  name: string;
  probability: number;
  color: string;
}

export interface Winner {
  id: string;
  contestantId: string;
  prizeId: string;
  timestamp?: Date;
} 