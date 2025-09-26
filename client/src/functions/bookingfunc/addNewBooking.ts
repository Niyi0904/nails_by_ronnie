import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";
import api from "@/utils/api";

export const addNewBooking = async (bookingData: any) => {
  try {
    // Reference to user doc (use email carefully as ID)
    const userDocRef = doc(db, "users", bookingData.email);
    const snapshot = await getDoc(userDocRef);

    // Create user doc if it doesn't exist
    if (!snapshot.exists()) {
      await setDoc(userDocRef, {
        email: bookingData.email,
      });
    }

    // Create a booking inside user's "bookings" subcollection
    const bookingDocRef = doc(collection(userDocRef, "bookings"));
    await setDoc(bookingDocRef, bookingData);

    await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: bookingData.name, email: bookingData.email }),
    });

    console.log("Booking saved & email sent ✅");
  } catch (error) {
    console.error("Error adding new booking:", error);
    throw error;
  }
};