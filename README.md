## Invoice Frontend

This is a Next.js frontend application that consumes the NestJS backend for managing invoices.

### Project Setup

#### Clone the Repository
```bash
git clone https://github.com/latestbob/invoicefrontend.git
cd invoicefrontend
```

#### Install Dependencies
```bash
npm install  # or yarn install
```

### Environment Variables

Create a `.env` file in the project root and add the following environment variables:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=invoice
```

Replace `your-cloud-name`, `your-api-key`, and `your-api-secret` with actual values.

### Running the Application

#### Start the Development Server
```bash
npm run dev  # or yarn dev
```

The application will be available at `http://localhost:3000`.

#### Run the application
```bash
npm run dev
```

#### Start the Production Server
```bash
npm start
```



### Additional Notes
- Ensure the [NestJS Backend](https://github.com/latestbob/nestinvoice.git) is running before testing API calls.
- The frontend relies on Cloudinary for file uploads.

Happy Coding! 🚀
