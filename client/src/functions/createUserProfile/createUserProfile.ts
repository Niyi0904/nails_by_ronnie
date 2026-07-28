import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/Firebase/firebaseUtils';
import { uploadImage } from '@/functions/uploadImage/uploadImage';
import { logFirebaseError } from '@/lib/Firebase/firebaseLogger';

interface AdditionalData {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  image: File | null;
}

/**
 * createUserProfile
 *
 * Creates a Firestore user document keyed by Firebase Auth UID.
 *
 * IMPORTANT CHANGE: Previous version used email as the document ID:
 *   doc(db, 'users', userAuth.user.email)   ← WRONG — breaks with special chars
 *
 * Now uses Firebase UID:
 *   doc(db, 'users', userAuth.user.uid)     ← CORRECT — always a safe string
 *
 * This aligns with:
 *   - Firestore Security Rules (request.auth.uid == uid)
 *   - AppInitializer lookup
 *   - Login page lookup
 *   - Booking subcollection path
 */
export const createUserProfile = async (
  userAuth: any,
  additionalData: AdditionalData
) => {
  if (!userAuth) return null;

  // Use UID — never email — as the Firestore document key
  const userRef = doc(db, 'users', userAuth.user.uid);

  // Check if profile already exists to avoid overwriting
  const existing = await getDoc(userRef);
  if (existing.exists()) {
    return userRef;
  }

  // Upload profile picture if provided
  let profilePictureUrl = '';
  if (additionalData.image) {
    try {
      const uploadResult = await uploadImage(additionalData.image);
      profilePictureUrl = uploadResult?.data?.url || '';
    } catch (uploadErr) {
      console.warn('Profile image upload failed — proceeding without image', uploadErr);
    }
  }

  try {
    await setDoc(userRef, {
      UserId: userAuth.user.uid,
      full_name: additionalData.name,
      email: additionalData.email,
      phoneNumber: additionalData.phoneNumber,
      address: additionalData.address,
      role: 'user',
      profilePicture: profilePictureUrl,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    logFirebaseError('createUserProfile', error);
    throw error;
  }

  return userRef;
};