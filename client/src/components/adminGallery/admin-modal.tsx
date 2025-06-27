"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { closeModal, setImage } from "@/redux/features/gallerySlice";
import { MdOutlineCancel } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { setDescription, setName } from "@/redux/features/gallerySlice";
import api from "@/utils/api";
import toast from 'react-hot-toast';




export default function AdminModal() {
  const [image, setImage] = useState<File | undefined>(undefined);
  const dispatch = useAppDispatch();
  const { isModalOpen, name, description} = useAppSelector((state) => state.gallery);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    err: unknown;
    message: string;
  } | null>(null);
  if (!isModalOpen) return null;



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if(image) {
      formData.append('image', image);
    }

    try {
      const response = await api.post('/gallery/addNewGallery', formData);
      console.log(response);
      toast.success('Gallery added successfuly');
      
    } catch (err: any) {
      let errorMessage = 'Internal server error, please try again';

      if (err.response) {
        // Backend returned a non-2xx status code
        errorMessage = err.response.data?.error || err.response.data?.message || 'Something went wrong';
        console.error('Response Error:', err.response);
        console.log(formData);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your internet or try again later.';
        console.error('Request Error:', err.request);
      } else {
        // Other errors (e.g., bad config)
        errorMessage = err.message || 'Unexpected error occurred.';
        console.error('General Error:', err.message);
      }
      toast.error(errorMessage);
      setSubmitStatus({
        success: false,
        err: err,
        message: errorMessage
      })
    } finally{
      console.log(formData);
    }


  }
 
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FCE4EC] dark:bg-[#1E1B23] shadow-2xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.6), 0 50px 100px -20px rgba(0, 0, 0, 0.4)' }}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add new Gallery</h2>
          <button
            onClick={() => dispatch(closeModal())}
            className="text-gray-400 hover:text-gray-600"
          >
            <MdOutlineCancel className=" h-6 w-6"/>
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => dispatch(setName(e.target.value))}
                required
                id="name"
                className="border-pink-800"
                />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description">Description</label>
              <input 
                type='text'
                value={description}
                onChange={(e) => dispatch(setDescription(e.target.value))}
                required
                id="description"
                className="border-pink-800"
                />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description">Image</label>
              <input
                type='file'
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0])}
                required
                id= "image"
                className="border-pink-800"
              />
            </div>

            <div>
              <button type="submit">
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
