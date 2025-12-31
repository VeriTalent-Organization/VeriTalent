"use client";

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  User,
  FileText,
  Briefcase,
  MessageSquare,
  X,
  MoreHorizontal
} from 'lucide-react';
import { Notification } from '@/types/dashboard';
import { jobsService } from '@/lib/services/jobsService';
import { referencesService } from '@/lib/services/referencesService';
import { screeningService } from '@/lib/services/screeningService';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Derive notifications from various services
        const [jobs, refs, sessions] = await Promise.all([
          jobsService.getMyPosted(),
          referencesService.getMyReferences(),
          screeningService.getSessions()
        ]);

        const derivedNotifications: Notification[] = [];

        // From jobs: new applications (mock since no applicants API)
        jobs.forEach((job: any) => {
          derivedNotifications.push({
            id: `job-${job.id}`,
            type: 'application',
            title: 'Job Posted',
            message: `Your job "${job.title}" has been posted successfully`,
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl: '/dashboard',
            priority: 'medium'
          });
        });

        // From references: pending/issued
        refs.forEach((ref: any) => {
          derivedNotifications.push({
            id: `ref-${ref.id}`,
            type: 'reference',
            title: ref.status === 'pending' ? 'Reference Request' : 'Reference Updated',
            message: `Reference for ${ref.title} is ${ref.status}`,
            timestamp: ref.dateSubmitted || new Date().toISOString(),
            read: false,
            actionUrl: '/dashboard/references',
            priority: ref.status === 'pending' ? 'high' : 'medium'
          });
        });

        // From screening: session updates
        sessions.forEach((session: any) => {
          derivedNotifications.push({
            id: `screen-${session.id}`,
            type: 'screening',
            title: 'Screening Session',
            message: `Screening session for job ${session.jobId} is active`,
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl: '/dashboard/screening',
            priority: 'medium'
          });
        });

        setNotifications(derivedNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'reference':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'screening':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                Stay updated with your latest activities and updates
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread'
                  ? 'You\'re all caught up!'
                  : 'You don\'t have any notifications yet.'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 ' + getPriorityColor(notification.priority) : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-gray-900 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`mt-1 text-sm ${
                          !notification.read ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                        )}

                        <div className="relative">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      {notification.actionUrl && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-brand-primary hover:text-brand-primary/80 font-medium"
                        >
                          View Details
                        </button>
                      )}

                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Mark as Read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-sm text-red-600 hover:text-red-800 ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
