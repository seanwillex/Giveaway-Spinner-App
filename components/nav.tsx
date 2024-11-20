'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Gift },
  { name: 'Prize Wheel', href: '/wheel', icon: RotateCw },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Gift className="h-8 w-8" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-2 border-b-2 px-1 pt-1 text-sm font-medium',
                    pathname === item.href
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-muted-foreground/50'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 