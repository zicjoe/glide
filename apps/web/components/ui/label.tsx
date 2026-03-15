"use client";

import * as React from "react";
import { cn } from "./utils";

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none text-gray-900",
        className,
      )}
      {...props}
    />
  );
}

export { Label };