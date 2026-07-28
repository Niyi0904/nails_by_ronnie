import { addDoc, collection,  query, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";
import { logFirebaseError } from "@/lib/Firebase/firebaseLogger";


export const addNewReview = async (reviewData: any) => {
    if (!reviewData) return;
  try {
    const reviewDocRef = collection(db, "reviews");

      const response = await addDoc(reviewDocRef, {
        name: reviewData.name,
        description: reviewData.description,
        stars: reviewData.stars,
        createdAt: serverTimestamp()
      })

      return response;
  } catch (error) {
    logFirebaseError('addNewReview', error);
    throw error;
  }
};

export const FetchAllReviews = async (): Promise<any|string> => {

    try {
        const reviewRef = collection(db, "reviews");
        const q = query(reviewRef, orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
        return "No review found.";
        } else {
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        }
    } catch (error) {
        logFirebaseError('FetchAllReviews', error);
        throw error;
    }

}
