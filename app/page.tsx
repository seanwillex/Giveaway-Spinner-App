'use client';

import { useState, useEffect } from 'react';
import { RegistrationForm } from '@/components/registration-form';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/components/data-table/columns';
import { Contestant } from '@/types';

export default function Home() {
  const [contestants, setContestants] = useState<Contestant[]>([]);

  useEffect(() => {
    const storedContestants = localStorage.getItem('contestants');
    if (storedContestants) {
      setContestants(JSON.parse(storedContestants));
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Register for Giveaway</h1>
        <RegistrationForm />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Contestants</h2>
        <DataTable columns={columns} data={contestants} />
      </div>
    </div>
  );
}
