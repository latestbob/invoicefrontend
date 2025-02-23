"use client";
import { InvoiceInterface, InvoiceItem } from "@/types/invoice";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { updateInvoice } from "@/services/invoiceService";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "@/services/uploadService";

export default function EditInvoice({ invoice }: { invoice: any }) {
  const [formData, setFormData] = useState({
    customerName: invoice.customerName,
    status: invoice.status,
    items: JSON.parse(invoice.items),
    grandTotal: parseFloat(invoice.grandTotal), // Ensure grandTotal is a number
    dueDate: invoice.dueDate,
    file: null,
  });

  // Handle input changes for customer name and status
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding a new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      itemName: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };

    // Add the new item to the items array
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, newItem],
    }));
  };

  // Handle changes to item fields
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Recalculate the total for the item
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total =
        Number(updatedItems[index].quantity) * Number(updatedItems[index].unitPrice);
    }

    // Update the items array
    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));

    // Recalculate the grand total
    const newGrandTotal = updatedItems.reduce((sum, item) => sum + Number(item.total), 0);
    console.log("New Grand Total:", newGrandTotal); // Debugging
    setFormData((prevData) => ({
      ...prevData,
      grandTotal: newGrandTotal,
    }));
  };


  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
    }
  };


  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    let fileUrl = "";
    if (file) {
      // Upload the file to Cloudinary
      fileUrl = await uploadFileToCloudinary(file);
      setUploadUrl(fileUrl);
    }

    if (formData.items.length === 0) {
      toast.error("Items cannot be empty");
      return;
    }

    if (formData.grandTotal === 0) {
      toast.error("Grand total cannot be 0");
      return;
    }

    const newInvoice: InvoiceInterface = {
      customerName: formData.customerName,
      dueDate: moment(formData.dueDate).toISOString(),
      items: JSON.stringify(formData.items), // Convert array to JSON string
      grandTotal: formData.grandTotal,
      status: formData.status,
      uploadUrl: fileUrl,
    };

    try {
      const createdInvoice = await updateInvoice(invoice.id, newInvoice);
      toast.success("Invoice updated successfully");
      window.location.href = "/"; // Navigate to the home page after successful update
    } catch (error) {
      toast.error("Failed to update invoice");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-black shadow-sm py-3">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <a className="text-white font-bold text-xl" href="/">
            Sales Invoice
          </a>
          <Link
            href="/"
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Back
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-10 max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold">Edit Invoice</h2>
        <p className="text-gray-500">Invoice #{invoice.invoiceNumber}</p>
        <p className="text-gray-500">Due Date: {moment(invoice.dueDate).format("YYYY-MM-DD")}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Customer Details */}
          <div>
            <label className="block font-medium">Bill To:</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Invoice Status */}
          <div>
            <label className="block font-medium">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-medium">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Invoice Items */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Unit Price</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item: InvoiceItem, index: number) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(index, "itemName", e.target.value)
                        }
                        className="w-full p-1 border rounded-md"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", Number(e.target.value))
                        }
                        className="w-full p-1 border rounded-md"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", Number(e.target.value))
                        }
                        className="w-full p-1 border rounded-md"
                      />
                    </td>
                    <td className="border p-2">{item.total.toFixed(2)}</td>
                    <td className="border p-2">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const updatedItems = formData.items.filter((_: any, i: number) => i !== index);
                          setFormData((prevData) => ({
                            ...prevData,
                            items: updatedItems,
                          }));

                          // Recalculate grand total
                          const newGrandTotal = updatedItems.reduce(
                            (sum: number, item: InvoiceItem) => sum + Number(item.total),
                            0
                          );
                          setFormData((prevData) => ({
                            ...prevData,
                            grandTotal: newGrandTotal,
                          }));
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
              onClick={addItem}
            >
              + Add Item
            </button>
          </div>

          {/* File Upload & Grand Total */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Grand Total:</label>
              <input
                type="text"
                name="grandTotal"
                value={formData.grandTotal.toFixed(2)}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Upload File (optional)</label>
              <input
                type="file"
               
                className="w-full p-2 border rounded-lg"
                accept=".jpg,.jpeg,.png,.gif,.docx,.xlsx"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}