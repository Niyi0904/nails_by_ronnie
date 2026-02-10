'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaCalendarCheck, FaImages, FaUsers, FaLock, FaSpa } from "react-icons/fa";

const ADMIN_LINKS = [
  {
    title: "Manage Services",
    href: "/admin/services",
    icon: <FaSpa />,
    description: "Create treatment categories and update service pricing.",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Manage Bookings",
    href: "/admin/booking",
    icon: <FaCalendarCheck />,
    description: "View, confirm, or reschedule client sessions.",
    color: "from-purple-500 to-indigo-600"
  },
  {
    title: "Manage Gallery",
    href: "/admin/gallery",
    icon: <FaImages />,
    description: "Upload new work and manage showcase images.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    title: "Manage Cart",
    href: "/admin/cart",
    icon: <FaShoppingCart />,
    description: "Manage physical products and inventory items.",
    color: "from-pink-500 to-rose-600"
  },
  {
    title: "Manage Users",
    href: "/admin/user",
    icon: <FaUsers />,
    description: "View client profiles and account permissions.",
    color: "from-amber-500 to-orange-600"
  }
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: AppState) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Robust Admin Check
    if (!user || user.role !== "admin") {
      router.replace("/");
    } else {
      setIsAuthorized(true);
    }
  }, [user, router]);

  // Prevent UI flicker while checking role
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen pt-20 pb-20 px-6 bg-gray-50/50 dark:bg-[#0F0E13]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#943F54]/10 rounded-lg text-[#943F54]">
              <FaLock size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#943F54]">
              System Administration
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2 max-w-md">
            Welcome back, {user?.full_name?.split(' ')[0]}. Here is what's happening with your business today.
          </p>
        </header>

        {/* Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ADMIN_LINKS.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={link.href} className="group block h-full">
                <div className="relative h-full p-8 bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#943F54]/30 transition-all duration-300 overflow-hidden">
                  
                  {/* Decorative Background Icon */}
                  <div className="absolute -right-4 -bottom-4 text-gray-50 dark:text-gray-800/20 group-hover:text-[#943F54]/5 transition-colors duration-500 pointer-events-none">
                    {cloneElement(link.icon, { size: 160 })}
                  </div>

                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-gray-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300`}>
                      {link.icon}
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                      {link.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-[240px]">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper to clone icon with new size
import { cloneElement } from "react";