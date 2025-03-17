"use client";

import React from "react";
import {
  DialogContent as BaseDialogContent,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@/app/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/app/lib/utils";

// Custom DialogContent with styled default close button
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof BaseDialogContent>,
  React.ComponentPropsWithoutRef<typeof BaseDialogContent>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <BaseDialogContent
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogClose className="absolute right-5 top-5 z-30 rounded-full bg-black/20 p-2 text-white hover:bg-black/30 transition-colors duration-200 focus:outline-none">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </BaseDialogContent>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";
