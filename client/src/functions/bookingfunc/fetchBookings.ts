import { db } from "@/lib/Firebase/firebaseUtils"
import { getDocs, collection, collectionGroup,  query, orderBy } from "firebase/firestore"

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

export const FetchAllBookings = async (): Promise<any|string> => {

    try {
    // 🔑 query across ALL subcollections named "bookings"
    const bookingsRef = collectionGroup(db, "bookings");
    const q = query(bookingsRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return "No bookings found.";
    } else {
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }

}