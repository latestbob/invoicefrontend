import EditInvoice from "@/components/editInvoice";

import { notFound } from "next/navigation";

// src/app/invoices/[id]/edit/page.tsx
export default async function InvoicePage({ params }: { params?: { id: string } }) {
    // Await params to ensure it's resolved
    if (!params || !params.id) {
        return notFound(); // Ensures the page returns a 404 if params are missing
      }
    const { id } = params;
  
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const API_URL = `${API_BASE_URL}invoices/${id}`;
  
    try {
      const res = await fetch(API_URL, { cache: "no-store" }); // No cache for fresh data
      if (!res.ok) {
        throw new Error("Failed to fetch invoice");
      }
  
      const invoice = await res.json();
      return (
            <div>
              <EditInvoice invoice={invoice} />
            </div>
          );
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return <div>Failed to load invoice.</div>;
    }
  }