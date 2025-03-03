import axios from "axios";
import { InvoiceInterface } from "@/types/invoice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchInvoices({
  status,
  startDate,
  endDate,
}: {
  status?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}invoices`, {
      params: {
        status,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

//create invoice

export async function createInvoice(invoiceData: InvoiceInterface) {
  try {
    const response = await axios.post(`${API_BASE_URL}invoices`, invoiceData);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create invoice:", error.response?.data || error);
    throw error;
  }
}

///update invoice

export async function updateInvoice(
  invoiceId: string,
  invoiceData: InvoiceInterface
) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}invoices/${invoiceId}`,
      invoiceData
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to update invoice:", error.response?.data || error);
    throw error;
  }
}

//delete invoice

export async function deleteInvoice(invoiceId: string) {
  try {
    const response = await axios.delete(`${API_BASE_URL}invoices/${invoiceId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete invoice:", error.response?.data || error);
    throw error;
  }
}
