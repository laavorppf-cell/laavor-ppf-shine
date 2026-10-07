import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "./catalog.functions";

export interface Spec {
  label: string;
  value: string;
}

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
});

/** Convert local Iraqi number (07xxxxxxxxx) to wa.me link */
export function waLink(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "964" + digits.slice(1) : digits;
  return `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
