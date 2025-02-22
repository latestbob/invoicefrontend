"use client";

import { fetchInvoices } from "@/services/invoiceService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { InvoiceInterface } from "@/types/invoice";
import moment from "moment";
import { InvoiceItem } from "@/types/invoice";
import { createInvoice } from "@/services/invoiceService";
import { toast } from "react-toastify";
import Link from "next/link";
// import { toast } from "react-toastify";

export default function Home() {



  const [invoices, setInvoices] = useState<any[]>([]);

  async function loadInvoices() {
    const data = await fetchInvoices();
    setInvoices(data);
  }

  useEffect(() => {
  
    loadInvoices();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);


  const[customerName, setCustomerName] = useState<string>("");
  const[status, setStatus] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  // Function to add a new item row
  const addItem = () => {
    setItems([...items, { itemName: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  // Function to handle item input changes
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems: InvoiceItem[] = [...items];
    updatedItems[index][field] = value as never;

    // Calculate total amount for the item
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setItems(updatedItems);

    // Recalculate grand total
    const newGrandTotal: number = updatedItems.reduce((sum, item) => sum + item.total, 0);
    setGrandTotal(newGrandTotal);
  };

  // Function to remove an item
  const removeItem = (index:any) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    // Recalculate grand total
    const newGrandTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    setGrandTotal(newGrandTotal);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
   
   

    if (items.length === 0) {
      toast.error("Items cannot be empty");
      return;
    }

    if (grandTotal === 0) {
      toast.error("Grand total cannot be 0");
      return;
    }

    const newInvoice: InvoiceInterface = {
      customerName,
     dueDate: moment(dueDate).toISOString(),
      items: JSON.stringify(items), // Convert array to JSON string
      grandTotal,
      status,
    };

    try {
      const createdInvoice = await createInvoice(newInvoice);
  
      toast.success("Invoice created successfully");
      await loadInvoices(); // 
      setIsModalOpen(false);




    } catch (error) {
      toast.error("Failed to create invoice");
    }



    setIsModalOpen(false); // Close the modal after submission
  };

  
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
            onClick={() => setIsModalOpen(true)}
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
                  
                   <td className="p-3">{ moment(invoice.dueDate).format("YYYY-MM-DD")}</td>
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
                     <Link href={`/invoices/${invoice.id}`} className="text-blue-500 hover:text-blue-700 mr-2">
                       View
                     </Link>
                     <Link href={`/invoices/${invoice.id}/edit`}  className="text-amber-500 hover:text-amber-700 mr-2">
                       Edit
                     </Link>
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

      {/* Create Invoice Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
        className="bg-white rounded-lg shadow-lg p-6 w-[60%]"
        onClick={(e) => e.stopPropagation()}
          >
        <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
        <form onSubmit={handleSubmit}>

          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Customer Name"
              onChange={handleCustomerNameChange}
              className="w-1/2 p-2 border border-gray-300 rounded-md"required
            />
            <input
              type="date"
              placeholder="Due Date"
              onChange={handleDueDateChange}
              className="w-1/2 p-2 border border-gray-300 rounded-md"required
            />
          </div>




          {items.map((item, index) => (
            <div key={index} className="mb-4">
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) =>
            handleItemChange(index, "itemName", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
            handleItemChange(index, "quantity", Number(e.target.value))
              }
              className="w-1/4 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(e) =>
            handleItemChange(index, "unitPrice", Number(e.target.value))
              }
              className="w-1/4 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Total"
              value={item.total}
              readOnly
              className="w-1/4 p-2 border border-gray-300 rounded-md bg-gray-100"
            />



            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mb-4"
          >
            Add Item
          </button>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Grand Total: {grandTotal}</span>
          </div>


            <div className="flex space-x-2 mb-4">
            <select
              name="status" onChange={handleStatusChange}
              className="w-1/2 p-2 border border-gray-300 rounded-md"required
            >
              <option value="">Select Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="canceled">Canceled</option>
            </select>
            {/* <label className="w-1/2 p-2 border border-gray-300 rounded-md"></label>
              Optional (image, docx, and excel only) */}
          
            <input
              type="file"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
            </div>



          <div className="flex justify-end">
            <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 mr-2"
            >
          Cancel
            </button>
            <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
          Save Invoice
            </button>
          </div>
        </form>
          </div>
        </div>
      )}
    </>
  );
}