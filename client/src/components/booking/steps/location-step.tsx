"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setEmail, setLocation, setName, setPhone, setStep, loadUserDetails } from "@/redux/features/bookingSlice";

import { IoArrowBack} from "react-icons/io5";

import GoogleMapComponent from "@/components/goggleMap";
import {useRef, useState, useEffect } from "react";


export default function LocationStep() {
  // const phone = useRef('');
  // const name = useRef('');
  const dispatch = useAppDispatch();
  const { subServiceType, location, email, phone, name} = useAppSelector((state) => state.booking);
  const { user } = useAppSelector((state) => state.auth);


  useEffect(() => {
    if (user) {
      dispatch(loadUserDetails({
        email: user.email,
        phone: user.phone_number,
        name: user.full_name
      }));
    }
  }, [user, dispatch]);


  const handleBack = () => {
    dispatch(setStep(4));
  };

  const handleNext = () => {
    if (location) {
      dispatch(setStep(6));
    }
  };

  const handleLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLocation(e.target.value));
  }
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setName(e.target.value));
  }
  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPhone(e.target.value));
  }
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value));
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Contact Info</h3>

      {/* <div>
        <GoogleMapComponent/>
      </div> */}

      <div>
        <label htmlFor="name">Name</label>
        <input
          type='text'
          id="name"
          value={name}
          onChange={handleName}
          placeholder="Input your name"
          className="w-full h-14 mb-4 focus:ring-1 focus:ring-pink-400 border px-5 rounded-xl border-pink-400"
        />
      </div>

      <div>
        <label htmlFor="phone">Phone</label>
        <input
          type='number'
          id="phone"
          value={phone}
          onChange={handlePhone}
          placeholder="Input your phone number"
          className="w-full h-14 mb-4 focus:ring-1 focus:ring-pink-400 border px-5 rounded-xl border-pink-400"
        />
      </div>

      <div>
        <label htmlFor="phone">email</label>
        <input
          type='email'
          id="email"
          value={email}
          onChange={handleEmail}
          placeholder="Input your email number"
          className="w-full h-14 mb-4 focus:ring-1 focus:ring-pink-400 border px-5 rounded-xl border-pink-400"
        />
      </div>

      <div>
        <label htmlFor="location">Location</label>
        <input
          type='text'
          id="location"
          value={location}
          onChange={handleLocation}
          placeholder="Input your Location"
          className="w-full h-14 mb-4 focus:ring-1 focus:ring-pink-400 border px-5 rounded-xl border-pink-400"
        />
      </div>
              

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={handleBack}>
            <IoArrowBack className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleNext}
          disabled={!location}
          className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#D77A8B] flex justify-center disabled:cursor-not-allowed items-center-safe hover:text-white bg-[#943F54] dark:bg-[#943F54] dark:hover:bg-[#D77A8B]"
        >
          Next
        </button>
      </div>
    </div>
  );
}