import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchInvoices() {
  try {
    const response = await axios.get(`${API_BASE_URL}invoices`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}
