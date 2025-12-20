
import React, { useState } from 'react';
import { 
  Sparkles, Tag, ShoppingBag, Shield, 
  Trash2, CheckCheck, MessageSquare, 
  ArrowRight, Flame
} from 'lucide-react';
import { Notification, NotificationType } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: 'New Match for your Broadcast!',
    message: 'Someone just listed a "2-Burner Gas Stove" that matches your request in Moremi Hall.',
    time: '2 mins ago',
    isRead: false,
    relatedImage: 'https://images.unsplash.com/photo-1521203050033-780598859941?w=150',
    actionLabel: 'View Match',
    actionPayload: { type: 'view_listing', id: '6' }
  },
  {
    id: '2',
    type: 'price_drop',
    title: 'Price Drop Alert!',
    message: 'The "Mini Refrigerator" you viewed is now N65,000 (was N75,000).',
    time: '1 hour ago',
    isRead: false,
    relatedImage: 'https://images.unsplash.com/photo-1571175452281-04a282879717?w=150',
    actionLabel: 'Check Deal',
    actionPayload: { type: 'view_listing', id: '1' }
  },
  {
    id: '3',
    type: 'offer',
    title: 'New Offer Received',
    message: 'A student made an offer of N250,000 for your "HP Laptop".',
    time: '3 hours ago',
    isRead: true,
    relatedImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150',
    actionLabel: 'Review Offer',
    actionPayload: { type: 'view_offer', id: 'offer_1' }
  },
  {
    id: '4',
    type: 'trending',
    title: 'Trending on Campus',
    message: 'Scientific calculators are in high demand this week! Got one to sell?',
    time: '5 hours ago',
    isRead: true,
    actionLabel: 'Post Listing',
    actionPayload: { type: 'navigate_tab', tab: 'Add Product' }
  },
  {
    id: '5',
    type: 'system',
    title: 'Account Verified',
    message: 'Your university email has been successfully verified. You can now post unlimited listings.',
    time: 'Yesterday',
    isRead: true,
  }
];

interface NotificationsViewProps {
  onAction: (payload: any) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onAction }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'matches'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'match': return <Sparkles className="text-sellit" size={20} />;
      case 'price_drop': return <Tag className="text-orange-500" size={20} />;
      case 'offer': return <MessageSquare className="text-blue-500" size={20} />;
      case 'trending': return <Flame className="text-red-500" size={20} />;
      default: return <Shield className="text-gray-400" size={20} />;
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'matches') return n.type === 'match';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Notifications</h1>
          <p className="text-gray-500 font-medium">Stay updated with your listings and campus matches.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-sellit hover:text-sellit transition-all shadow-sm group"
        >
          <CheckCheck size={18} className="group-hover:scale-110 transition-transform" />
          Mark all as read
        </button>
      </div>

      <div className="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
        {(['all', 'unread', 'matches'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
              filter === tab 
                ? 'bg-white text-sellit shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
            {tab === 'unread' && notifications.filter(n => !n.isRead).length > 0 && (
              <span className="ml-2 bg-sellit text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`group relative bg-white border border-gray-100 rounded-[2rem] p-6 transition-all hover:shadow-xl hover:shadow-gray-200/50 ${
                !notification.isRead ? 'ring-1 ring-sellit/20 bg-sellit/[0.02]' : ''
              }`}
            >
              {!notification.isRead && (
                <div className="absolute top-8 left-3 w-1.5 h-1.5 bg-sellit rounded-full" />
              )}

              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${
                  !notification.isRead ? 'bg-white shadow-sm' : 'bg-gray-50'
                }`}>
                  {getTypeIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight truncate pr-8">
                      {notification.title}
                    </h3>
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap uppercase tracking-tight">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed text-[15px] mb-4">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {notification.actionLabel && (
                        <button 
                          onClick={() => notification.actionPayload && onAction(notification.actionPayload)}
                          className="flex items-center gap-2 px-5 py-2 bg-sellit text-white rounded-xl text-xs font-extrabold hover:bg-sellit-dark transition-all shadow-lg shadow-sellit/10 active:scale-95"
                        >
                          {notification.actionLabel}
                          <ArrowRight size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {notification.relatedImage && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                        <img src={notification.relatedImage} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-200 rounded-[3rem]">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-400 font-medium max-w-xs">
              When students interact with your items or broadcasts, you'll see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
