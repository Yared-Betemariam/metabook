import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FormControl } from "@/components/ui/form";

interface DropdownProps {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  formControl?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onChange,
  value,
  placeholder,
  className,
  disabled,
  formControl,
}) => {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(e) => onChange(e)}
    >
      {formControl ? (
        <FormControl>
          <SelectTrigger className={cn("w-full", className)}>
            <SelectValue className="" placeholder={placeholder || "Filter"} />
          </SelectTrigger>
        </FormControl>
      ) : (
        <SelectTrigger className={cn("w-fit", className)}>
          <SelectValue className="" placeholder={placeholder || "Filter"} />
        </SelectTrigger>
      )}
      <SelectContent align="end" className="w-fit">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {options.length <= 0 && (
          <SelectItem disabled value={"none"}>
            No items here
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;

// utils fuction

export const useDropdownValuesFromAPI = (apiRoute: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(apiRoute);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        if (Array.isArray(result.data) && result.data.length > 0) {
          setData(result.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiRoute]);

  return { isLoading, data };
};
