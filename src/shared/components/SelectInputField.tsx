"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  // ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  // ComboboxValue,
} from "./ui/combobox";
import { Button } from "./ui/button";

export type Option = {
  label: string;
  value: string;
  image?: string;
  disabled?: boolean;
};

type SelectInputFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  showPlaceholderImage?: string;
  disabled?: boolean;
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

export const SelectInputField = React.forwardRef<
  HTMLButtonElement,
  SelectInputFieldProps
>(
  (
    {
      label,
      id,
      error,
      options,
      placeholder,
      value,
      onChange,
      className,
      showPlaceholderImage,
      containerStyles,
      disabled = false,
      onReachEnd,
      hasNextPage,
      isFetchingNextPage,
      ...props
    },
    ref,
  ) => {
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const sentinelRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
      if (!listRef.current || !sentinelRef.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            onReachEnd?.();
          }
        },
        { root: listRef.current, threshold: 0.1 },
      );
      observer.observe(sentinelRef.current);
      return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onReachEnd]);
    const selectedOption = options.find((o) => o.value === value);
    // console.log("selectedOption", selectedOption);

    return (
      <div className={cn("flex w-full flex-col", containerStyles)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}
          </label>
        )}

        <Combobox
          id={id}
          items={options}
          value={options.find((o) => o.value === value) ?? null}
          onValueChange={(option) =>
            onChange?.((option as Option)?.value ?? "")
          }
          disabled={disabled}
        >
          <ComboboxTrigger
            ref={ref}
            {...props}
            render={
              <Button
                // variant="outline"
                className={cn(
                  "bg-muted border-input h-13 w-full justify-between rounded-full px-4 text-sm font-normal",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:bg-disabled text-foreground",
                  error && "border-destructive",
                  className,
                )}
                aria-invalid={!!error}
              ></Button>
            }
          >
            {selectedOption ? (
              <>
                {showPlaceholderImage && selectedOption.image && (
                  <Image
                    src={selectedOption.image}
                    alt={selectedOption.label}
                    width={30}
                    height={15}
                  />
                )}
                <span>{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-muted-foreground flex gap-1">
                {showPlaceholderImage && (
                  <Image
                    src={showPlaceholderImage}
                    alt="flag assets"
                    width={30}
                    height={15}
                  />
                )}
                {placeholder || "Select an option"}
              </span>
            )}{" "}
          </ComboboxTrigger>

          <ComboboxContent>
            {/* <ComboboxInput
              showTrigger={false}
              placeholder="Search..."
            /> */}

            <ComboboxEmpty>No results found.</ComboboxEmpty>

            <ComboboxList
              ref={listRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
                if (remaining <= 4 && hasNextPage && !isFetchingNextPage) onReachEnd?.();
              }}
            >
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.label}
                      width={30}
                      height={15}
                    />
                  )}
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
            <div ref={sentinelRef} className="h-1 w-full" />
            {isFetchingNextPage && (
              <div className="text-muted-foreground px-2 pb-2 text-center text-xs">
                Loading...
              </div>
            )}
          </ComboboxContent>
        </Combobox>

        {error && (
          <span className="mt-1 text-[12px] text-red-500">{error}</span>
        )}
      </div>
    );
  },
);

SelectInputField.displayName = "SelectInputField";
