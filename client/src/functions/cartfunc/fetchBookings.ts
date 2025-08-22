import { db } from "@/lib/Firebase/firebaseUtils"
import { getDocs, collection, query, orderBy } from "firebase/firestore"

export const FetchCart = async (userEmail: string): Promise<any|string> => {

    try {
        const collectionRef = collection(db, 'users', userEmail, 'cart');

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