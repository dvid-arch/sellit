
import { User, Listing, Chat, Notification, Broadcast, Offer, Transaction } from '../types.ts';

class StorageService {
  private readonly KEYS = {
    USER: 'sellit_user',
    LISTINGS: 'sellit_listings',
    CHATS: 'sellit_chats',
    NOTIFICATIONS: 'sellit_notifications',
    BROADCASTS: 'sellit_broadcasts',
    OFFERS: 'sellit_offers',
    TRANSACTIONS: 'sellit_transactions',
    SAVED_LISTINGS: 'sellit_saved_listings',
  };

  // Helper methods
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // User Management
  saveUser(user: User): void {
    this.setItem(this.KEYS.USER, user);
  }

  getUser(): User | null {
    return this.getItem<User>(this.KEYS.USER);
  }

  logout(): void {
    this.removeItem(this.KEYS.USER);
  }

  // Listings Management
  getListings(): Listing[] {
    return this.getItem<Listing[]>(this.KEYS.LISTINGS) || [];
  }

  saveListings(listings: Listing[]): void {
    this.setItem(this.KEYS.LISTINGS, listings);
  }

  addListing(listing: Listing): void {
    const listings = this.getListings();
    listings.unshift(listing); // Add to beginning
    this.saveListings(listings);
  }

  updateListing(id: string, updates: Partial<Listing>): void {
    const listings = this.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index !== -1) {
      listings[index] = { ...listings[index], ...updates };
      this.saveListings(listings);
    }
  }

  deleteListing(id: string): void {
    const listings = this.getListings().filter(l => l.id !== id);
    this.saveListings(listings);
  }

  // Saved Listings
  getSavedListings(): string[] {
    return this.getItem<string[]>(this.KEYS.SAVED_LISTINGS) || [];
  }

  toggleSavedListing(id: string): void {
    const saved = this.getSavedListings();
    const index = saved.indexOf(id);
    if (index === -1) {
      saved.push(id);
    } else {
      saved.splice(index, 1);
    }
    this.setItem(this.KEYS.SAVED_LISTINGS, saved);
  }

  isListingSaved(id: string): boolean {
    return this.getSavedListings().includes(id);
  }

  // Chats Management
  getChats(): Chat[] {
    return this.getItem<Chat[]>(this.KEYS.CHATS) || [];
  }

  saveChats(chats: Chat[]): void {
    this.setItem(this.KEYS.CHATS, chats);
  }

  addMessage(chatId: string, message: { text: string; senderId: string }): void {
    const chats = this.getChats();
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const newMessage = {
        id: crypto.randomUUID(),
        text: message.text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        senderId: message.senderId,
      };
      chat.messages.push(newMessage);
      chat.lastMessage = message.text;
      chat.lastMessageTime = newMessage.timestamp;
      this.saveChats(chats);
    }
  }

  addChat(chat: Chat): void {
    const chats = this.getChats();
    chats.unshift(chat);
    this.saveChats(chats);
  }

  // Notifications Management
  getNotifications(): Notification[] {
    return this.getItem<Notification[]>(this.KEYS.NOTIFICATIONS) || [];
  }

  saveNotifications(notifications: Notification[]): void {
    this.setItem(this.KEYS.NOTIFICATIONS, notifications);
  }

  addNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.unshift(notification);
    this.saveNotifications(notifications);
  }

  markAsRead(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications(notifications);
    }
  }

  markAllAsRead(): void {
    const notifications = this.getNotifications();
    notifications.forEach(n => n.isRead = true);
    this.saveNotifications(notifications);
  }

  deleteNotification(id: string): void {
    const notifications = this.getNotifications().filter(n => n.id !== id);
    this.saveNotifications(notifications);
  }

  clearNotifications(): void {
    this.setItem(this.KEYS.NOTIFICATIONS, []);
  }

  // Broadcasts Management
  getBroadcasts(): Broadcast[] {
    return this.getItem<Broadcast[]>(this.KEYS.BROADCASTS) || [];
  }

  saveBroadcasts(broadcasts: Broadcast[]): void {
    this.setItem(this.KEYS.BROADCASTS, broadcasts);
  }

  addBroadcast(broadcast: Broadcast): void {
    const broadcasts = this.getBroadcasts();
    broadcasts.unshift(broadcast);
    this.saveBroadcasts(broadcasts);
  }

  // Offers Management
  getOffers(): Offer[] {
    return this.getItem<Offer[]>(this.KEYS.OFFERS) || [];
  }

  saveOffers(offers: Offer[]): void {
    this.setItem(this.KEYS.OFFERS, offers);
  }

  addOffer(offer: Offer): void {
    const offers = this.getOffers();
    offers.unshift(offer);
    this.saveOffers(offers);
  }

  updateOfferStatus(id: string, status: Offer['status']): void {
    const offers = this.getOffers();
    const offer = offers.find(o => o.id === id);
    if (offer) {
      offer.status = status;
      this.saveOffers(offers);
    }
  }

  // Transactions Management
  getTransactions(): Transaction[] {
    return this.getItem<Transaction[]>(this.KEYS.TRANSACTIONS) || [];
  }

  saveTransactions(transactions: Transaction[]): void {
    this.setItem(this.KEYS.TRANSACTIONS, transactions);
  }

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
  }

  // Initialization - check if first time user
  isFirstTimeUser(): boolean {
    return !localStorage.getItem(this.KEYS.LISTINGS);
  }

  // Clear all data (for testing/reset)
  clearAll(): void {
    Object.values(this.KEYS).forEach(key => this.removeItem(key));
  }
}

export const storageService = new StorageService();
