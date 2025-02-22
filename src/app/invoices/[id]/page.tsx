import Invoice from "@/components/invoice";
import { notFound } from "next/navigation";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_URL = `${API_BASE_URL}invoices/${params.id}`;

  const res = await fetch(API_URL, { cache: "no-store" }); // No cache for fresh data
  if (!res.ok) {
    if (!res.ok) return notFound(); 
  }

  const invoice = await res.json();

  return (
    <div>
      <Invoice invoice={invoice} />
    </div>
  );
}
