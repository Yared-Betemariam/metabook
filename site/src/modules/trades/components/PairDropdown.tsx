/* eslint-disable react/no-unescaped-entities */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaSortDown } from "react-icons/fa";

interface PairDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Default trading pairs
const DEFAULT_PAIRS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCHF",
  "AUDUSD",
  "USDCAD",
  "NZDUSD",
  "EURJPY",
  "GBPJPY",
  "EURGBP",
  "AUDJPY",
  "EURAUD",
  "EURCHF",
  "AUDCAD",
  "GBPCHF",
  "CADCHF",
  "NZDJPY",
  "AUDCHF",
  "GBPCAD",
  "GBPAUD",
  "CHFJPY",
  "EURNZD",
  "AUDNZD",
  "GBPNZD",
  "EURCAD",
  "CADJPY",
  "SGDJPY",
  "ZARJPY",
  "BTCUSD",
  "ETHUSD",
  "XAUUSD",
  "XAGUSD",
  "USOUSD",
  "NAS100",
  "SPX500",
  "GER40",
  "UK100",
  "JPN225",
  "AUS200",
  "FRA40",
  "HK50",
  "EUSTX50",
];

const STORAGE_KEY = "trading-pairs";

export function PairDropdown({ value, onChange, disabled }: PairDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [customPairs, setCustomPairs] = useState<string[]>([]);
  const [allPairs, setAllPairs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPairs = JSON.parse(stored);
        setCustomPairs(parsedPairs);
        setAllPairs([...DEFAULT_PAIRS, ...parsedPairs]);
      } else {
        setAllPairs(DEFAULT_PAIRS);
      }
    } catch (error) {
      console.error("Error loading pairs from localStorage:", error);
      setAllPairs(DEFAULT_PAIRS);
    }
  }, []);

  const saveCustomPairs = (pairs: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
    } catch (error) {
      console.error("Error saving pairs to localStorage:", error);
    }
  };

  const addCustomPair = (newPair: string) => {
    const upperPair = newPair.toUpperCase().trim();

    if (!upperPair || allPairs.includes(upperPair)) {
      return;
    }

    const updatedCustomPairs = [...customPairs, upperPair];
    setCustomPairs(updatedCustomPairs);
    setAllPairs([...DEFAULT_PAIRS, ...updatedCustomPairs]);
    saveCustomPairs(updatedCustomPairs);
    onChange(upperPair);
    setOpen(false);
    setSearchValue("");
  };

  const filteredPairs = allPairs.filter((pair) =>
    pair.toLowerCase().includes(searchValue.toLowerCase())
  );

  const canAddNew = useMemo(
    () =>
      searchValue.trim() &&
      !allPairs.some(
        (pair) => pair.toLowerCase() === searchValue.toLowerCase().trim()
      ) &&
      searchValue.trim().length >= 3,
    [searchValue]
  );

  const handleSelect = (selectedPair: string) => {
    onChange(selectedPair);
    setOpen(false);
    setSearchValue("");
  };

  const handleAddNew = () => {
    addCustomPair(searchValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <span>{value}</span>
            </div>
          ) : (
            "Select pair"
          )}
          <FaSortDown className="size-5 mb-1.5 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            disabled={disabled}
            placeholder="Search pairs..."
            value={searchValue}
            onValueChange={(e) => setSearchValue(e.toUpperCase())}
          />
          <CommandList>
            {filteredPairs.length === 0 && !canAddNew && (
              <CommandEmpty>No trading pairs found.</CommandEmpty>
            )}

            {canAddNew && (
              <>
                <Button
                  variant={"outline"}
                  onClick={handleAddNew}
                  className="cursor-pointer border-none w-full justify-start font-normal"
                >
                  <Plus className="mr-2 h-4 w-4 rounded-full border border-dashed bg-zinc-100" />
                  Add{" "}
                  <span className="font-medium">
                    {searchValue.toUpperCase().trim()}
                  </span>
                </Button>
              </>
            )}

            {filteredPairs.length > 0 && (
              <>
                {/* Default pairs */}
                <CommandGroup>
                  {filteredPairs
                    .filter((pair) => DEFAULT_PAIRS.includes(pair))
                    .map((pair) => (
                      <CommandItem
                        key={pair}
                        value={pair}
                        onSelect={() => handleSelect(pair)}
                        className="cursor-pointer"
                      >
                        {pair}
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 ml-auto",
                            value === pair ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>

                {/* Custom pairs */}
                {filteredPairs.some((pair) => customPairs.includes(pair)) && (
                  <CommandGroup>
                    {filteredPairs
                      .filter((pair) => customPairs.includes(pair))
                      .map((pair) => (
                        <CommandItem
                          key={pair}
                          value={pair}
                          onSelect={() => handleSelect(pair)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {pair}
                            <Badge
                              variant="secondary"
                              className="text-xs rounded-full"
                            >
                              Custom
                            </Badge>
                          </div>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 ml-auto",
                              value === pair ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
