import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";

export const addToCart = async (cartData: any) => {
    const CartCollection = doc(db, 'users', cartData.email);
    const snapshot = await getDoc(CartCollection);

    if (!snapshot.exists()) {
        setDoc(CartCollection, {
            email: cartData.email,
        })
    }
    

    const cartItemDoc = doc(collection(CartCollection, 'cart'));
    await setDoc(cartItemDoc, cartData);
}