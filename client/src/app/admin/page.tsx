'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useEffect } from "react";

export default function Admin() {
    const router = useRouter();
    const {user, isAuthenticated} = useSelector((state: AppState) => state.auth);

    
    useEffect(() => {
    if (!user || user.role !== "admin") {
        router.push("/");
    
        return;
    }
    // fetchBookings();
    }, [user]);


    return(
        <div  className="mt-20 mx-[5%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="w-full h-64 justify-center flex items-center-safe bg-[#FF69B440] dark:bg-[#1c398e40] dark:border-blue-900 border-4 border-pink-700 dark:text-blue-900 text-pink-700 rounded-xl font-bold text-3xl hover:scale-105">
                    <Link href='/admin/cart'>
                        Manage Cart
                    </Link>
                </div>
                <Link href='/admin/booking' className="w-full h-64 justify-center flex items-center-safe bg-[#FF69B440] dark:bg-[#1c398e40] dark:border-blue-900 border-4 border-pink-700 dark:text-blue-900 text-pink-700 rounded-xl font-bold text-3xl hover:scale-105">
                        Manage Bookings
                </Link>
                <div className="w-full h-64 justify-center flex items-center-safe bg-[#FF69B440] dark:bg-[#1c398e40] dark:border-blue-900 border-4 border-pink-700 dark:text-blue-900 text-pink-700 rounded-xl font-bold text-3xl hover:scale-105">
                    <Link href='/admin/gallery'>
                        Manage Gallery
                    </Link>
                </div>
                <div className="w-full h-64 justify-center flex items-center-safe bg-[#FF69B440] dark:bg-[#1c398e40] dark:border-blue-900 border-4 border-pink-700 dark:text-blue-900 text-pink-700 rounded-xl font-bold text-3xl hover:scale-105">
                    <Link href='/admin/user'>
                        Manage Users
                    </Link>
                </div>
            </div>
        </div>
    );
};