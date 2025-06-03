'use client'

import BannerCarousel from "@/components/homeBanner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Herosection () {
    const router = useRouter();
    return (
        <div className="mt-5">
            <BannerCarousel />
            <section className="text-center space-y-3 mt-3 max-w-2xl mx-auto">
                <h2 className="text-4xl font-extrabold">Your Nail Care, Reimagined</h2>
                <p className="text-lg dark:text-[#B3B3C3]">
                Book appointments, shop beauty essentials, and chat directly with Lagos' best nails technician — all in one place.
                </p>
                <div className="flex justify-center gap-4">
                <Link href='/my-bookings' className="primary text-white px-5 py-2 rounded shadow hover:opacity-90">
                    Book a Session
                </Link>
                <Link href='/shop' className="border border-[#D77A8B] text-[#D77A8B] dark:text-[#F2F2F2] px-5 py-2 rounded hover:bg-[#D77A8B] hover:text-white dark:hover:bg-[#943F54] transition">
                    Explore Shop
                </Link>
                </div>
            </section>
        </div>
    );
}