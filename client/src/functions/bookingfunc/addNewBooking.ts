import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";

export const addNewBooking = async (bookingData: any) => {
    const bookingsCollection = doc(db, 'users', bookingData.email);
    const snapshot = await getDoc(bookingsCollection);

    if (!snapshot.exists()) {
        setDoc(bookingsCollection, {
            email: bookingData.email,
        })
    }
    

    const bookingDoc = doc(collection(bookingsCollection, 'bookings'));
    await setDoc(bookingDoc, bookingData);
}