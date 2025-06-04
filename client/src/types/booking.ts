
export interface Property {
    _id: string;
    name: string;
    address: string;
    type: string;
    subType: string;
    size: string;
    status: string;
    images: string[];
  }
  
  export interface Cleaner {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: string;
    avatar?: string;
  }
  
  export interface CleaningBusiness {
    _id: string;
    name?: string;
  }
  
  export interface Booking {
    id: string
    userId: string
    name: string
    phone: string
    service_type: string
    sub_category: string
    booking_date: string
    booking_time: string
    booking_status: BookingStatus
    booking_location: string
    additional_notes: string
  }
  
  export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
  
  export interface TimelineEvent {
    date: string;
    time: string;
    event: string;
    icon: React.ReactNode;
    person?: {
      name: string;
      avatar?: string;
    };
    company?: string;
  }