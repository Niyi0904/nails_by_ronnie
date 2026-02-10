import { addDoc, collection, query, getDocs, serverTimestamp, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebaseUtils";

// --- CATEGORY FUNCTIONS ---
export const addServiceCategory = async (name: string) => {
  try {
    const categoryRef = collection(db, "service-categories");
    const response = await addDoc(categoryRef, {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'), // useful for URLs
      createdAt: serverTimestamp()
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to add category: ${error}`);
  }
};

export const fetchCategories = async () => {
  const categoryRef = collection(db, "service-categories");
  const q = query(categoryRef, orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- SERVICE FUNCTIONS ---
export const addNewService = async (serviceData: {
  name: string;
  price: number;
  duration: string;
  description: string;
  categoryId: string;
}) => {
  try {
    const serviceRef = collection(db, "services");
    const response = await addDoc(serviceRef, {
      ...serviceData,
      createdAt: serverTimestamp()
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to add service: ${error}`);
  }
};

export const fetchAllServices = async () => {
  const serviceRef = collection(db, "services");
  const q = query(serviceRef, orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};