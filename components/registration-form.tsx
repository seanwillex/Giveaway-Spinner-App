'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Contestant } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  state: z.string().min(2, 'Please enter a valid state'),
  number: z.number().min(1).max(20, 'Number must be between 1 and 20'),
});

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      state: '',
      number: 1,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const contestant: Contestant = {
        id: crypto.randomUUID(),
        ...values,
        createdAt: new Date(),
      };
      const contestants = JSON.parse(localStorage.getItem('contestants') || '[]');
      contestants.push(contestant);
      localStorage.setItem('contestants', JSON.stringify(contestants));
      
      toast({
        title: 'Registration successful',
        description: 'Your entry has been recorded',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="California" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Lucky Number (1-20)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Register
        </Button>
      </form>
    </Form>
  );
} 