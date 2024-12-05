'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface ClientSelectorProps {
  clients: string[];
}

export function ClientSelector({ clients }: ClientSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('client');
    } else {
      params.set('client', value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={handleValueChange}
      defaultValue={searchParams.get('client') || 'all'}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select client" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Clients</SelectItem>
        {clients.map((client) => (
          <SelectItem key={client} value={client}>
            {client}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 