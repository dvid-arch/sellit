
export type AuthStep = 'signup' | 'login' | 'verify' | 'forgot_password' | 'authenticated';

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  bankDetails?: BankDetails;
}

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'countered';
export type ListingStatus = 'available' | 'committed' | 'sold';

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  images?: string[];
  seller: string;
  location: string;
  isUrgent?: boolean;
  isNegotiable?: boolean;
  isBoosted?: boolean; // New property
  status: ListingStatus;
  viewCount?: number;
  offerCount?: number;
}

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  type: 'buy' | 'sell';
  status: 'held_in_escrow' | 'released' | 'cancelled';
  timestamp: number;
  partnerName: string;
}

export interface ViewRecord {
  listingId: string;
  lastViewedPrice: number;
  timestamp: number;
}

export interface Offer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  originalPrice: number;
  offeredPrice: number;
  buyerName: string;
  buyerAvatar: string;
  message: string;
  status: OfferStatus;
  timestamp: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  agentName?: string; // For support messages
}

export interface Chat {
  id: string;
  contactName: string;
  contactAvatar: string;
  lastSeen: string;
  lastMessage: string;
  lastMessageTime: string;
  isSupport?: boolean;
  supportMeta?: {
    isOnline: boolean;
    estimatedWaitMinutes: number;
    activeAgentsCount: number;
    queuePosition?: number;
  };
  product?: {
    title: string;
    price: number;
    imageUrl: string;
  };
  messages: Message[];
}

export type NotificationType = 'match' | 'price_drop' | 'offer' | 'system' | 'trending' | 'payment';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  relatedImage?: string;
  actionLabel?: string;
  actionPayload?: {
    type: 'view_listing' | 'view_offer' | 'navigate_tab' | 'view_transaction';
    id?: string;
    tab?: string;
  };
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  icon?: string;
}

export interface Broadcast {
  id: string;
  author: string;
  authorAvatar: string;
  need: string;
  details: string;
  budgetMin: number;
  budgetMax: number;
  location: string;
  time: string;
  isBoosted: boolean;
  category: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: { web: { uri: string; title: string } }[];
}
