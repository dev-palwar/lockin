"use server";

import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import mongoose from "mongoose";

// Define the Image schema
interface IImage {
  url: string;
}

export async function uploadImage(file: File) {
  if (!file) {
    throw new Error("No file uploaded");
  }

  try {
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to Firebase Storage
    const storageRef = ref(storage, `lockin/${file.name}`);
    await uploadBytes(storageRef, buffer);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return { url: downloadURL };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload image");
  }
}
