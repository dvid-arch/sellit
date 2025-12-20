
import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Tag, ShoppingBag, Shield, 
  Trash2, CheckCheck, MessageSquare, 
  ArrowRight, Flame, BellOff, Settings2,
  Calendar, Clock, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Notification, NotificationType } from '../types';
import { useToast } from '../context/ToastContext';

interface NotificationsViewProps {
  notifications: Notification[];
  onAction: (payload: any) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ 
  notifications, 
  onAction, 
  onMarkAllRead, 
  onDelete,
  onMarkRead,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'deals'>('all');
  const { showToast } = useToast();

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'match': return { icon: <Sparkles size={20} />, color: 'text-sellit', bg: 'bg-sellit/10' };
      case 'price_drop': return { icon: <Tag size={20} />, color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'offer': return { icon: <MessageSquare size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'trending': return { icon: <Flame size={20} />, color: 'text-red-500', bg: 'bg-red-50' };
      case 'payment': return { icon: <CheckCircle2 size={20} />, color: 'text-green-500', bg: 'bg-green-50' };
      default: return { icon: <Shield size={20} />, color: 'text-gray-400', bg: 'bg-gray-50' };
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'unread') return !n.isRead;
      if (filter === 'deals') return n.type === 'price_drop' || n.type === 'offer' || n.type === 'payment';
      return true;
    });
  }, [notifications, filter]);

  // Design Thinking: Grouping notifications by time for better cognitive processing
  const groupedNotifications = useMemo(() => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];

    filteredNotifications.forEach(n => {
      if (n.time.includes('min') || n.time.includes('hour')) today.push(n);
      else if (n.time.toLowerCase().includes('yesterday')) yesterday.push(n);
      else earlier.push(n);
    });

    return { today, yesterday, earlier };
  }, [filteredNotifications]);

  const handleAction = (notification: Notification) => {
    if (!notification.isRead) onMarkRead(notification.id);
    if (notification.actionPayload) {
      onAction(notification.actionPayload);
    }
  };

  const renderSection = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4 mb-10">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
          <Calendar size={12} /> {title}
        </h3>
        {items.map((notification) => {
          const styles = getTypeStyles(notification.type);
          return (
            <div 
              key={notification.id}
              onClick={() => handleAction(notification)}
              className={`group relative bg-white border border-gray-100 rounded-[2.5rem] p-6 transition-all cursor-pointer hover:shadow-2xl hover:shadow-gray-200/50 hover:border-sellit/20 ${
                !notification.isRead ? 'ring-1 ring-sellit/10 bg-sellit/[0.01]' : ''
              }`}
            >
              {!notification.isRead && (
                <div className="absolute top-8 left-3 w-1.5 h-1.5 bg-sellit rounded-full animate-pulse" />
              )}

              <div className="flex items-start gap-6">
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${styles.bg} ${styles.color}`}>
                  {styles.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-black text-gray-900 text-lg leading-tight truncate pr-8 group-hover:text-sellit transition-colors">
                      {notification.title}
                    </h4>
                    <span className="text-[10px] font-black text-gray-400 whitespace-nowrap uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} /> {notification.time}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed text-sm mb-5">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {notification.actionLabel && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(notification); }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-sellit text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sellit-dark transition-all shadow-lg shadow-sellit/10 active:scale-95"
                        >
                          {notification.actionLabel}
                          <ArrowRight size={14} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(notification.id); showToast('Deleted', 'Notification removed.', 'info', 2000); }}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {notification.relatedImage && (
                      <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden border border-gray-100 shadow-sm shrink-0 group-hover:rotate-3 transition-transform">
                        <img src={notification.relatedImage} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Inbox</h1>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="bg-sellit text-white px-4 py-1 rounded-full text-xs font-black animate-bounce shadow-lg">
                {notifications.filter(n => !n.isRead).length} NEW
              </span>
            )}
          </div>
          <p className="text-gray-500 font-bold text-lg">Your campus intelligence hub.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { onMarkAllRead(); showToast('Caught up!', 'All notifications marked as read.', 'success'); }}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:border-sellit hover:text-sellit transition-all shadow-sm group"
          >
            <CheckCheck size={18} className="group-hover:scale-110 transition-transform" />
            Mark all read
          </button>
          <button 
            onClick={() => { onClearAll(); showToast('Cleared', 'Notification history wiped.', 'info'); }}
            className="p-3.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-2xl border border-transparent hover:border-red-100 transition-all"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-12 bg-gray-100/50 p-2 rounded-[1.5rem] w-fit">
        {[
          { id: 'all', label: 'All activity', icon: ShoppingBag },
          { id: 'unread', label: 'Unread', icon: BellOff },
          { id: 'deals', label: 'Money & Deals', icon: Tag },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === tab.id 
                ? 'bg-white text-sellit shadow-lg shadow-sellit/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List Grouped by Time */}
      {filteredNotifications.length > 0 ? (
        <div className="animate-in fade-in duration-500">
          {renderSection('Today', groupedNotifications.today)}
          {renderSection('Yesterday', groupedNotifications.yesterday)}
          {renderSection('Earlier', groupedNotifications.earlier)}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-gray-100 rounded-[4rem] animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-8 border border-gray-100 shadow-inner">
            <BellOff size={48} />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">Peace and quiet</h3>
          <p className="text-gray-400 font-medium max-w-xs mb-10 leading-relaxed">
            Your inbox is empty. We'll ping you when your campus deals start moving!
          </p>
          <button 
            onClick={() => onAction({ type: 'navigate_tab', tab: 'Home' })}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
          >
            Discover Deals <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Footer Settings Link */}
      <div className="mt-20 border-t border-gray-100 pt-10 flex items-center justify-between">
         <div className="flex items-center gap-3 text-gray-400">
            <Settings2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Notification Preferences</span>
         </div>
         <button className="text-[10px] font-black text-sellit uppercase tracking-widest hover:underline">Manage Alerts</button>
      </div>
    </div>
  );
};
