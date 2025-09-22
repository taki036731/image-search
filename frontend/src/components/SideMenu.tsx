import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SearchForm, type SearchFormProps } from "./SearchForm";

export function SideMenu({ query, onQueryChange, onSearch, isLoading }: SearchFormProps) {
  console.log("SideMenu component rendered");
  return (
    <div className="absolute top-5 left-5 z-20">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Image Search</SheetTitle>
            <SheetDescription>
              Enter a search term to start the slideshow.
            </SheetDescription>
          </SheetHeader>
           <div className="grid gap-4 py-4">
            <SearchForm query={query} onQueryChange={onQueryChange} onSearch={onSearch} isLoading={isLoading} />
            <div className="grid gap-2">
              <a href="#" className="p-2 hover:bg-accent rounded-md">Home</a>
              <a href="#" className="p-2 hover:bg-accent rounded-md">Settings</a>
              <a href="#" className="p-2 hover:bg-accent rounded-md">Profile</a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}