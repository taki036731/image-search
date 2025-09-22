import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SearchForm } from "./SearchForm";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SideMenuProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  interval: number;
  onIntervalChange: (value: number) => void;
  animation: string;
  onAnimationChange: (value: string) => void;
}

export function SideMenu(props: SideMenuProps) {
  console.log("SideMenu component rendered");
  return (
    <div className="absolute top-5 left-5 z-20">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-2">
          <SheetHeader>
            <SheetTitle>Image Search</SheetTitle>
          </SheetHeader>
           <div className="grid gap-4 py-4">
            <SearchForm {...props} />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="interval">Interval ({props.interval / 1000}s)</Label>
                <Slider
                  id="interval"
                  min={2000}
                  max={10000}
                  step={500}
                  value={[props.interval]}
                  onValueChange={(value) => props.onIntervalChange(value[0])}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="animation">Animation</Label>
                <Select value={props.animation} onValueChange={props.onAnimationChange}>
                  <SelectTrigger id="animation">
                    <SelectValue placeholder="Select animation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade-in">Fade</SelectItem>
                    <SelectItem value="zoom-in">Zoom</SelectItem>
                    <SelectItem value="slide-in-from-left">Slide Left</SelectItem>
                    <SelectItem value="slide-in-from-right">Slide Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}