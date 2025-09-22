import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchForm({ query, onQueryChange, onSearch }: SearchFormProps) {
  console.log("SearchForm component rendered");
  return (
    <div className="flex w-full items-center">
      <Input
        id="search"
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search for images..."
        className="rounded-r-none focus-visible:ring-offset-0"
      />
      <Button onClick={onSearch} className="rounded-l-none">
        Search
      </Button>
    </div>
  );
}