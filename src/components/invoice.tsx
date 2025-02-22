import moment from "moment";
import Link from "next/link";

export default function Invoice({ invoice }: { invoice: any }) {
    return (
        <>

         {/* Navbar */}
      <nav className="bg-black shadow-sm py-3">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <a className="text-white font-bold text-xl" href="/">
            Sales Invoice
          </a>
          <Link href="/"
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            
          >
            Back
          </Link>
        </div>
      </nav>

            <div className="container mx-auto mt-5 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Header Section */}
          <div className="flex justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">Invoice</h2>
              <p className="text-gray-500">Invoice #{invoice.invoiceNumber}</p>
              <p className="text-gray-500">Due Date: { moment(invoice.dueDate).format("YYYY-MM-DD")}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Sales Invoice</p>
              <p className="text-gray-500">123 Milverton Road</p>
              <p className="text-gray-500">Lagos, Nigeria</p>
              <p className="text-gray-500">edidiongbobson@gmail.com</p>
            </div>
          </div>
  
          {/* Customer and Total Section */}
          <div className="flex justify-between mt-6">
            <div>
              <h5 className="font-bold">Bill To:</h5>
              <p>{invoice.customer_name}</p>
            </div>
            <div className="text-right">
              <h5 className="font-bold">Invoice Total:</h5>
              <p className="text-xl text-blue-600 font-bold">
                ₦{invoice.grandTotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
  
          {/* Invoice Items Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Unit Price</th>
                  <th className="p-3 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(invoice.items).map((item: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 border">{item.itemName}</td>
                    <td className="p-3 border">{item.quantity}</td>
                    <td className="p-3 border">₦{item.unitPrice.toFixed(2)}</td>
                    <td className="p-3 border">₦{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Totals */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-500">Thank you for your business!</p>
            <div className="w-1/3">
              <table className="w-full border border-gray-200">
                <tbody>
                  <tr>
                    <th className="p-3 bg-gray-100 border">Subtotal</th>
                    <td className="p-3 border">
                      ₦{invoice.grandTotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-3 bg-gray-100 border">Tax (0%)</th>
                    <td className="p-3 border">₦0.00</td>
                  </tr>
                  <tr>
                    <th className="p-3 bg-gray-100 border">Grand Total</th>
                    <td className="p-3 font-bold border">
                      ₦{invoice.grandTotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        
        </>
        
      
    );
  }
  