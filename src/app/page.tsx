"use client";

import { fetchInvoices } from "@/services/invoiceService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { InvoiceInterface } from "@/types/invoice";

export default function Home() {



  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    async function loadInvoices() {
      const data = await fetchInvoices();
      setInvoices(data);
    }
    loadInvoices();
  }, []);

  
  return (
    <>
      {/* Navbar */}
      <nav className="bg-black shadow-sm py-3">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <a className="text-white font-bold text-xl" href="/">
            Sales Invoice
          </a>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            data-bs-toggle="modal"
            data-bs-target="#createInvoiceModal"
          >
            Create Invoice
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-4 px-5">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          {/* Filter by Status */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <select
              name="status"
              id="status"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Filter Status</option>
              {/* Add more options here */}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="w-full md:w-1/2 flex items-center justify-end space-x-3">
            <label className="text-gray-700">Start</label>
            <input
              type="date"
              name="start_date"
              id="startDate"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-gray-700">End</label>
            <input
              type="date"
              name="end_date"
              id="endDate"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <hr className="my-5 border-gray-300" />

        {/* Invoice Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-5">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount(N)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Table rows will go here */}

                {invoices && invoices.map((invoice, index) => (
                   <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition duration-300">
                   <td className="p-3">{invoice.invoiceNumber}</td>
                   <td className="p-3">{invoice.dueDate}</td>
                   <td className="p-3">{invoice.customerName}</td>
                   <td className="p-3">{invoice.grandTotal}</td>
                   <td className="p-3">
               

                    {invoice.status === "paid" && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        Paid
                      </span>
                    )}
                    {invoice.status === "pending" && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    )}
                    {invoice.status === "draft" && (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                        Draft
                      </span>
                    )}
                    {invoice.status === "sent" && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        Sent
                      </span>
                    )}
                    {invoice.status === "canceled" && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                        Canceled
                      </span>
                    )}
                   </td>
                   <td className="p-3">
                     <button className="text-blue-500 hover:text-blue-700 mr-2">
                       View
                     </button>
                     <button className="text-amber-500 hover:text-amber-700 mr-2">
                       Edit
                     </button>
                     <button className="text-red-500 hover:text-red-700">
                       Delete
                     </button>
                   </td>
                 </tr>
              
                ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}