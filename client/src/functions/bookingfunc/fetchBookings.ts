import { db } from "@/lib/Firebase/firebaseUtils"
import { 
  getDocs, 
  collection, 
  collectionGroup,  
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc // 1. Added deleteDoc import
} from "firebase/firestore"

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

export const updateBooking = async (bookingId: string, newStatus: string, bookingEmail: string) => {
  try {
    const docRef = doc(db, "users", bookingEmail, "bookings", bookingId);
    await updateDoc(docRef, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

/**
 * Deletes a specific booking from a user's subcollection
 */
export const deleteBooking = async (bookingId: string, bookingEmail: string) => {
  try {
    if (!bookingEmail) throw new Error("User email is required to locate booking.");
    
    const docRef = doc(db, "users", bookingEmail, "bookings", bookingId);
    await deleteDoc(docRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};