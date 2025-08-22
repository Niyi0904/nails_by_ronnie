import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";
import { uploadImage } from '@/functions/uploadImage/uploadImage';
import { serverTimestamp } from "firebase/firestore";

interface additionalData {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  image: File | null
}

export const createUserProfile = async (userAuth: any, additionalData: additionalData) => {
  if (!userAuth) return;

  const userRef = doc(db, 'users', userAuth.user.email);

  const { email } = userAuth.user;
  const {name, address, phoneNumber} = additionalData; 
  const image = await uploadImage(additionalData.image as File); 
  try {
    await setDoc(userRef, {
      full_name: name,
      UserId: userAuth.user.uid,
      role: 'user',
      address,
      phoneNumber,
      email,
      profilePicture: image.data.url,
      createdAt: serverTimestamp(),
    });


  } catch (error) {
    console.error("Error creating user profile document", error);
  }
  

  return userRef;
}