import { db, auth } from "@/lib/Firebase/firebaseUtils"
import { getDocs, collection } from "firebase/firestore"

export const FetchCart = async (): Promise<any|string> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to view your cart.");
    }

    try {
        const collectionRef = collection(db, 'users', currentUser.uid, 'cart');

        const snapshot = await getDocs(collectionRef);

        if(snapshot.empty) {
            return "No cart item found for this user.";
        } else {
            return snapshot.docs.map( doc => ({id: doc.id, ...doc.data()}))
        }
        
    } catch (error) {
        console.error("Error fetching cart:", error);
    }

}