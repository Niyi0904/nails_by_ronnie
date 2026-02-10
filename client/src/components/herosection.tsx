'use client'
import dynamic from "next/dynamic";
import { useAppDispatch} from "@/hooks/useReduxHook";
import Link from "next/link";
import { useRouter } from "next/navigation";


const BookingModal = dynamic(() => import('./booking/booking-modal'), {
  ssr: false,
});

const BannerCarousel = dynamic(() => import('@/components/homeBanner'), {
    ssr: false,
})


export default function Herosection () {
    const router = useRouter();
    

    return (
        <div className="mt-3">
            <div className="min-h-[370px] md:min-h-[470px]">
                <BannerCarousel />
            </div>

            <div className="relative z-10 mt-4 bg-white dark:bg-[#121212] mx-auto max-w-3xl rounded-2xl p-8 shadow-xl text-center border border-gray-50 dark:border-gray-800">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Your Nail Care, <span className="text-[#D77A8B]">Reimagined</span>
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                ✨ Where elegance meets perfection. Luxury nail care and bespoke designs 
                crafted to keep you looking effortlessly classy.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={() => router.push('/book')}
                    className="w-full sm:w-auto bg-[#D77A8B] text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-[#D77A8B]/30 hover:bg-[#c46a7a] hover:-translate-y-1 transition-all active:scale-95"
                >
                    Book an Appointment
                </button>
                
                <Link 
                    href='/shop' 
                    className="w-full sm:w-auto border-2 border-[#D77A8B] text-[#D77A8B] px-8 py-4 rounded-full font-semibold hover:bg-pink-50 dark:hover:bg-gray-800 transition-all"
                >
                    Explore Shop
                </Link>
                </div>
            </div>
            <BookingModal/>
        </div>
    );
}