// src/context/NotificationContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  subscribeToNotifications,
  markAsRead,
  markAllAsRead
} from '../services/notificationService'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }
    // Real-time Firestore listener
    const unsub = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data)
      setLoading(false)
    })
    return unsub
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id) => markAsRead(id)
  const handleMarkAllAsRead = () => user && markAllAsRead(user.uid)

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead: handleMarkAsRead,
      markAllAsRead: handleMarkAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}
