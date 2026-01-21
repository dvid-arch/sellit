
import { Listing, Notification, Chat, Broadcast } from '../types.ts';

export const SEED_LISTINGS: Listing[] = [
    {
        id: '1',
        title: 'Mini Refrigerator',
        price: 65000,
        category: 'Electronics',
        isUrgent: true,
        isNegotiable: true,
        description: 'Compact fridge perfect for dorm rooms. Keeps drinks cold and snacks fresh. Barely used, moving out sale!',
        imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=800&auto=format&fit=crop',
        seller: 'Obokobong',
        location: 'Moremi Hall',
        status: 'available',
        viewCount: 45,
        offerCount: 3
    },
    {
        id: '2',
        title: 'HP Laptop',
        price: 275000,
        category: 'Electronics',
        description: 'HP Pavilion 15, 8GB RAM, 256GB SSD, Intel i5. Great for coding and multimedia. Comes with charger and laptop bag.',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
        seller: 'Obokobong',
        location: 'NDDC Hostel',
        status: 'available',
        viewCount: 120,
        offerCount: 1
    }
];

export const SEED_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'match',
        title: 'New Match for your Broadcast!',
        message: 'Someone just listed a "2-Burner Gas Stove" that matches your request in Moremi Hall.',
        time: '2 mins ago',
        isRead: false,
        relatedImage: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=150',
        actionLabel: 'View Item',
        actionPayload: { type: 'view_listing', id: 'new_1' }
    },
    {
        id: '2',
        type: 'price_drop',
        title: 'Price Drop Alert!',
        message: 'The "Study Desk" you viewed dropped from ₦38,000 to ₦32,000.',
        time: '1 hour ago',
        isRead: false,
        relatedImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=150',
        actionLabel: 'View Price',
        actionPayload: { type: 'view_listing', id: 'new_2' }
    }
];

export const SEED_SUPPORT_CHAT: Chat = {
    id: 'chat_support',
    contactName: 'Sellit Human Desk',
    contactAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
    lastSeen: 'Online',
    lastMessage: 'Hello! This is the human support desk. If you have issues with payments, escrow, or safety, we are here to help.',
    lastMessageTime: '09:00',
    isSupport: true,
    supportMeta: {
        isOnline: true,
        estimatedWaitMinutes: 2,
        activeAgentsCount: 3,
    },
    messages: [
        {
            id: 's1',
            text: 'Hello! This is the human support desk. If you have issues with payments, escrow, or safety, we are here to help.',
            timestamp: '09:00',
            senderId: 'them',
            agentName: 'Official Bot'
        }
    ]
};

export const SEED_BROADCASTS: Broadcast[] = [
    {
        id: 'b1',
        author: 'Sarah Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        need: 'Looking for a Study Lamp',
        details: 'Need a good reading lamp for late-night study sessions. Preferably with adjustable brightness.',
        budgetMin: 5000,
        budgetMax: 15000,
        location: 'Moremi Hall',
        time: '30 mins ago',
        isBoosted: false,
        category: 'Electronics'
    }
];
