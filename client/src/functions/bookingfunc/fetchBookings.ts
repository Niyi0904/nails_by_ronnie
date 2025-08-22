import { db } from "@/lib/Firebase/firebaseUtils"
import { getDocs, collection, query, orderBy } from "firebase/firestore"

export const FetchBookings = async (userEmail: string): Promise<any|string> => {

    try {
        const collectionRef = collection(db, 'users', userEmail, 'bookings');

        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const snapshot = await getDocs(q);

        if(snapshot.empty) {
            return "No bookings found for this user.";
        } else {
            return snapshot.docs.map( doc => ({id: doc.id, ...doc.data()}))
        }
        
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }

}