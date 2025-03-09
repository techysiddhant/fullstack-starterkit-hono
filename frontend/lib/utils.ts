import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function isApexDomain(domain: string) {
  return domain ? domain.split(".").length === 2 : null;
}
