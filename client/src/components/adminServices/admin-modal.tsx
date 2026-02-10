// "use client";

// import React, { useState } from "react";
// import { FaUpload } from "react-icons/fa6";
// import { MdOutlineCancel } from "react-icons/md";
// import toast from "react-hot-toast";
// import Loading from "@/app/(dashboard)/my-bookings/loading";
// import api from "@/utils/api";

// import { addNewService } from "@/functions/servicesfunc/addNewService";

// interface Props {
//   onAction: () => void;
//   isOpen?: boolean;
//   onClose?: () => void;
// }

// export default function AdminServiceModal({ onAction, isOpen = false, onClose }: Props) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState<string | number>("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState<File | undefined>(undefined);
//   const [loading, setLoading] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<{
//     success: boolean;
//     err: unknown;
//     message: string;
//   } | null>(null);

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!name || !description || !price) {
//       toast.error("Please fill the required fields.");
//       return;
//     }

//     setLoading(true);

//     const data = {
//       name,
//       description,
//       price: Number(price),
//       category,
//       image,
//     };

//     try {
//       // call service function (implement at functions/servicesfunc/addNewService)
//       const response = await addNewService(data);
//       toast.success("Service added successfully");
//       onAction();
//       if (onClose) onClose();
//     } catch (err: any) {
//       let errorMessage = "Internal server error, please try again";

//       if (err?.response) {
//         errorMessage = err.response.data?.error || err.response.data?.message || "Something went wrong";
//         console.error("Response Error:", err.response);
//       } else if (err?.request) {
//         errorMessage = "No response from server. Please check your internet or try again later.";
//         console.error("Request Error:", err.request);
//       } else {
//         errorMessage = err.message || "Unexpected error occurred.";
//         console.error("General Error:", err.message);
//       }

//       toast.error(errorMessage);
//       setSubmitStatus({ success: false, err, message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-[#1E1B23] shadow-2xl rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Add New Service</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <MdOutlineCancel className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="p-4 flex-1 overflow-y-auto">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="name">Name</label>
//               <input
//                 id="name"
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full border px-4 py-2 border-gray-300 rounded-lg"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="description">Description</label>
//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//                 className="w-full border px-4 py-2 border-gray-300 rounded-lg"
//                 rows={3}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label htmlFor="price">Price</label>
//                 <input
//                   id="price"
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   required
//                   className="w-full border px-4 py-2 border-gray-300 rounded-lg"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="category">Category</label>
//                 <input
//                   id="category"
//                   type="text"
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full border px-4 py-2 border-gray-300 rounded-lg"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="image">Image</label>
//               <input
//                 id="image"
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setImage(e.target.files?.[0])}
//                 className="w-full border px-4 py-2 border-gray-300 rounded-lg"
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="text-white px-5 py-2 rounded-lg bg-[#943F54] hover:bg-[#7a2d3f] flex items-center gap-3 disabled:opacity-60"
//                 disabled={loading}
//               >
//                 {!loading ? (
//                   <>
//                     <FaUpload className="h-4 w-4" /> Upload Service
//                   </>
//                 ) : (
//                   <Loading />
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
