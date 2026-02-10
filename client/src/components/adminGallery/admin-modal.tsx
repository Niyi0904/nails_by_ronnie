"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { closeModal, setName, setDescription } from "@/redux/features/gallerySlice";
import { MdOutlineCancel } from "react-icons/md";
import { FaUpload, FaCloudUploadAlt } from "react-icons/fa";
import toast from 'react-hot-toast';

import { addNewGallery } from "@/functions/galleryfunc/function";
import Loading from "@/app/(dashboard)/my-bookings/loading";

interface ChildProps {
  onAction: () => void;
}

export default function AdminModal({ onAction }: ChildProps) {
  const dispatch = useAppDispatch();
  const { isModalOpen, name, description } = useAppSelector((state) => state.gallery);
  const [localImage, setLocalImage] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!localImage) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    try {
      await addNewGallery({ name, description, image: localImage });
      toast.success('Gallery added successfully');
      onAction();
      handleClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLocalImage(undefined);
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-[#1A181E] shadow-2xl rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-lg max-h-[95vh] overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Reduced padding */}
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/10">
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">Add Gallery</h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Showcase your work</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-90"
          >
            <MdOutlineCancel className="h-6 w-6 text-gray-300 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Title Input - Compact */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[11px] font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider">
              Service Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => dispatch(setName(e.target.value))}
              placeholder="e.g. Deluxe Acrylic Set"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#943F54] outline-none transition-all dark:text-white text-sm"
              required
            />
          </div>

          {/* Description Input - Reduced height */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-[11px] font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider">
              Details
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => dispatch(setDescription(e.target.value))}
              placeholder="What makes this special?"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#943F54] outline-none transition-all dark:text-white min-h-[80px] text-sm resize-none"
              required
            />
          </div>

          {/* File Upload Box - Significantly shorter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider">
              Portfolio Image
            </label>
            <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:border-[#943F54] cursor-pointer transition-all group">
              <div className="flex items-center gap-3 px-4 text-center">
                <FaCloudUploadAlt className="w-5 h-5 text-[#943F54]" />
                <div className="text-left">
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-bold truncate max-w-[180px]">
                    {localImage ? localImage.name : "Select photo"}
                    </p>
                    {!localImage && <p className="text-[10px] text-gray-400">JPG, PNG (Max 10MB)</p>}
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setLocalImage(e.target.files?.[0])}
                required={!localImage}
              />
            </label>
          </div>

          {/* Action Button - Sticky-ready or compact */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#943F54] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.97] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loading />
              ) : (
                <>
                  <FaUpload className="text-sm" />
                  Publish Artwork
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}