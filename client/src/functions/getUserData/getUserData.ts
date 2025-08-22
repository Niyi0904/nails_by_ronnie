import { User } from "@/redux/features/authSlice";
import { getDoc } from "firebase/firestore";



export interface UserData extends User {
  UserId: string;
  phoneNumber: string;
}

export const GetUserData = async (documentRef: any): Promise<UserData | null> => {
  if (!documentRef) return null;

  const docSnap = await getDoc(documentRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  } else {
    console.log("No such document!");
    return null;
  }
}
