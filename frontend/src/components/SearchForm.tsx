import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface SearchFormProps {
  isLoading: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchForm({ query, onQueryChange, onSearch, isLoading }: SearchFormProps) {
  console.log("SearchForm component rendered");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      event.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="flex w-full items-center">
      <Input
        id="search"
        type="text"
        value={query}
        onKeyDown={handleKeyDown}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search for images..."
        className="rounded-r-none focus-visible:ring-offset-0"
         disabled={isLoading} />
      <Button onClick={onSearch} className="rounded-l-none" disabled={isLoading}>
        Search
      </Button>
    </div>
  );
}