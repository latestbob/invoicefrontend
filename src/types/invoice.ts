
  
  export interface InvoiceItem {
    itemName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }
  
  export interface InvoiceInterface {
    invoiceNumber?: string;
    customerName: string;
    dueDate: string;
    grandTotal: number;
    items: string;
    status: string;
    uploadUrl?: string;
  }
  