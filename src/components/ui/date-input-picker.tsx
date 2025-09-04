"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useIMask } from "react-imask";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateInputPickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateInputPicker({ value, onChange, placeholder = "DD/MM/AAAA" }: DateInputPickerProps) {
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  const { ref, value: maskedValue, setValue: setMaskedValue } = useIMask({
    mask: Date,
    pattern: "d/`m/`Y",
    lazy: true, 
    blocks: {
      d: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
      m: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
      Y: { mask: IMask.MaskedRange, from: 1900, to: 2099, maxLength: 4 },
    },
    format: (date) => format(date as Date, "dd/MM/yyyy"),
    parse: (str) => parse(str, "dd/MM/yyyy", new Date()),
  });

  React.useEffect(() => {
    if (value) {
      setMaskedValue(format(value, "dd/MM/yyyy"));
    } else {
      setMaskedValue('');
    }
  }, [value, setMaskedValue]);

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date);
    setPopoverOpen(false);
  };

  const handleMaskComplete = (str: string) => {
    const parsedDate = parse(str, "dd/MM/yyyy", new Date());
    if (isValid(parsedDate)) {
      onChange(parsedDate);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={ref as React.RefObject<HTMLInputElement>}
        defaultValue={maskedValue}
        placeholder={placeholder}
        onBlur={(e) => handleMaskComplete(e.target.value)}
        className="pr-10"
      />
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
            aria-label="Abrir calendário"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}