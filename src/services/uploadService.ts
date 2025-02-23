import axios from "axios";

export const uploadFileToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''); // Replace with your upload preset name

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      formData
    );
    console.log(response.data.secure_url);
    return response.data.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};