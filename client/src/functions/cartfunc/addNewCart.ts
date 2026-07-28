import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/Firebase/firebaseUtils";

export const addToCart = async (cartData: any) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to add items to your cart.");
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
        setDoc(userDocRef, {
            email: cartData.email,
        })
    }
    

    const cartItemDoc = doc(collection(userDocRef, 'cart'));
    await setDoc(cartItemDoc, cartData);
}