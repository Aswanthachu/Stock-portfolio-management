import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePicker({ formData, handleChange }) {

  const handleSelect = (value) => {
    const e = {
      target: {
        name: "date",
        value:value
      },
    };
    handleChange(e);
  };

  return (
    <>
      <h1 className="font-semibold ml-1 -mb-4">Valid Till</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              " justify-start text-left font-normal",
              !formData?.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formData && formData?.date ? (
              format(new Date(formData?.date), "PPP")
            ) : (
              <span>Select a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={formData?.date}
            name="date"
            onSelect={(e) => handleSelect(e)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
