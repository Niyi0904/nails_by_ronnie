import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";
import { uploadImage } from '@/functions/uploadImage/uploadImage';


export const addNewGallery = async (galleryData: any) => {
    if (!galleryData) return;
    const image = await uploadImage(galleryData.image as File);
  try {
    const galleryDocRef = collection(db, "gallery");

      const response = await addDoc(galleryDocRef, {
        name: galleryData.name,
        description: galleryData.description,
        imageUrl: image.data.url
      })

      return response;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const FetchAllGallery = async (): Promise<any|string> => {

    try {
    const galleryRef = collection(db, "gallery");
    const snapshot = await getDocs(galleryRef);

    if (snapshot.empty) {
      return "No gallery found.";
    } else {
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  } catch (error) {
    console.error("Error fetching gallery:", error);
    throw new Error(`${error}`);
  }

}
