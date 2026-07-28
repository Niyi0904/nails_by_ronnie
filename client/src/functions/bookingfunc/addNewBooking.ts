import { setDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";
import { logFirebaseError } from "@/lib/Firebase/firebaseLogger";

export const addNewBooking = async (bookingData: {
  email: string;
  name: string;
  phone: string;
  service_type: string;
  sub_category: any[];
  booking_date: string;
  booking_time: string;
  booking_location: string;
  additional_notes: string;
}) => {
  if (!bookingData.email) {
    throw new Error("Email is required to make a booking.");
  }

  try {
    const bookingDocRef = doc(collection(db, "users", bookingData.email, "bookings"));
    await setDoc(bookingDocRef, {
      ...bookingData,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: bookingData.name,
        email: bookingData.email,
        service: bookingData.service_type,
        treatments: bookingData.sub_category.map((s: any) => s.name).join(", "),
        date: bookingData.booking_date,
        time: bookingData.booking_time,
        location: bookingData.booking_location,
        notes: bookingData.additional_notes,
      }),
    });

    return { success: true, bookingId: bookingDocRef.id };
  } catch (error) {
    logFirebaseError('addNewBooking', error);
    throw error;
  }
};