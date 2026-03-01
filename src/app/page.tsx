'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { 
  Clock, Trophy, Bell, Users, ChevronRight, Zap,
  Calendar, Sun, Moon,
  Star, Award, ExternalLink, BellRing, Check, Globe,
  Gamepad2, Sword, Shield, Heart, Flame
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  events, roles, functionalRoles, DAYS,
  getTodayEvents, getNextEvent,
  xpPoapSources, monthlyContributorHighlights, importantNotes, importantLinks,
  type Event
} from '@/lib/events-data'
import { LanguageProvider, useLanguage, useDayName } from '@/lib/language-context'

// Get current day in UTC
function getCurrentUTCDay(): string {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  return days[new Date().getUTCDay()]
}

// Countdown timer hook
function useCountdown(targetTime: string, targetDay: string) {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, days: 0 })

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const currentDay = now.getUTCDay()
      const targetDayIndex = DAYS.indexOf(targetDay as typeof DAYS[number])
      
      let daysUntil = targetDayIndex - currentDay
      if (daysUntil < 0) daysUntil += 7
      if (daysUntil === 0) {
        const [hours, minutes] = targetTime.split(':').map(Number)
        const eventMinutes = hours * 60 + minutes
        const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
        if (eventMinutes <= nowMinutes) {
          daysUntil = 7
        }
      }

      const [eventHours, eventMinutes] = targetTime.split(':').map(Number)
      const eventDate = new Date(now)
      eventDate.setUTCHours(eventHours, eventMinutes, 0, 0)
      eventDate.setUTCDate(now.getUTCDate() + daysUntil)

      const diff = eventDate.getTime() - now.getTime()
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)
    return () => clearInterval(interval)
  }, [targetTime, targetDay])

  return countdown
}

// Current UTC time hook
function useCurrentTime() {
  const { language } = useLanguage()
  const [time, setTime] = useState('')
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      if (language === 'id') {
        setTime(now.toLocaleTimeString('en-US', { 
          timeZone: 'Asia/Jakarta', 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: true 
        }))
      } else {
        setTime(now.toLocaleTimeString('en-US', { 
          timeZone: 'UTC', 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: true 
        }))
      }
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [language])

  return time
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useEffect : () => {}

function PixelDecoration({ className }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="flex gap-0.5">
        <div className="w-2 h-2 bg-[#00fff7]" />
        <div className="w-2 h-2 bg-[#ff00ff]" />
        <div className="w-2 h-2 bg-[#39ff14]" />
      </div>
    </div>
  )
}

function GameControls({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      {children}
    </div>
  )
}

function PixelProgressBar({ value, max, color = "#39ff14" }: { value: number; max: number; color?: string }) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full h-4 border-2 border-[#2a2a4e] bg-[#0a0a0f] relative overflow-hidden">
      <div 
        className="h-full transition-all duration-300"
        style={{ 
          width: `${percentage}%`,
          background: `repeating-linear-gradient(
            90deg,
            ${color} 0px,
            ${color} 4px,
            transparent 4px,
            transparent 8px
          )`
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-pixel text-white drop-shadow-lg">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-10 h-10 p-0 border-3 border-[#ffd700] bg-[#12121a] hover:bg-[#ffd700]/20 pixel-button"
      onClick={toggleTheme}
    >
      {!mounted ? (
        <Sun className="w-5 h-5 text-[#ffd700]" />
      ) : theme === 'dark' ? (
        <Sun className="w-5 h-5 text-[#ffd700] pulse-neon" />
      ) : (
        <Moon className="w-5 h-5 text-[#ff00ff]" />
      )}
    </Button>
  )
}

function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-1.5 border-3 border-[#ff00ff] bg-[#12121a] hover:bg-[#ff00ff]/20 font-pixel text-xs pixel-button"
      onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
    >
      <Globe className="w-4 h-4 text-[#ff00ff]" />
      <span className="text-[#ff00ff] font-bold">{language === 'id' ? 'ID' : 'EN'}</span>
    </Button>
  )
}

function RoleSystemModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useLanguage()
  const getDayName = useDayName()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-[10px] neon-text-gold font-pixel">
            <div className="w-8 h-8 border-2 border-[#ffd700] bg-[#12121a] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#ffd700]" />
            </div>
            {t('roleSystem')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Role Hierarchy */}
          <section>
            <h3 className="text-[10px] font-pixel mb-3 flex items-center gap-2 neon-text-magenta">
              <Sword className="w-4 h-4" />
              {t('roleHierarchy')}
            </h3>
            <div className="space-y-2">
              {roles.map((role, index) => (
                <motion.div 
                  key={role.name} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border-3 border-[#2a2a4e] bg-[#12121a] hover:border-[#00fff7] transition-colors relative"
                >
                  <div className="absolute top-0 left-0 w-4 h-4 border-b-2 border-r-2 border-[#2a2a4e] bg-[#0a0a0f]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-b-2 border-l-2 border-[#2a2a4e] bg-[#0a0a0f]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-t-2 border-r-2 border-[#2a2a4e] bg-[#0a0a0f]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-t-2 border-l-2 border-[#2a2a4e] bg-[#0a0a0f]" />
                  
                  <div className="flex items-center gap-3">
                    {role.emoji && <span className="text-2xl float">{role.emoji}</span>}
                    <div className="flex-1">
                      <h4 className="text-xs font-pixel" style={{ color: role.color }}>
                        {role.name}
                      </h4>
                      <div className="mt-1 text-base">
                        <span className="text-[#8888aa]">{t('requirements')}: </span>
                        <span>{role.requirements}</span>
                      </div>
                      <div className="text-base">
                        <span className="text-[#8888aa]">{t('perks')}: </span>
                        <span>{role.perks}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Functional Roles */}
          <section>
            <h3 className="text-[10px] font-pixel mb-3 flex items-center gap-2 neon-text-lime">
              <Shield className="w-4 h-4" />
              {t('functionalRoles')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {functionalRoles.map((role) => (
                <div key={role.name} className="p-2 border-3 border-[#2a2a4e] bg-[#12121a] hover:border-[#39ff14] transition-colors">
                  <h4 className="text-xs font-pixel text-[#39ff14]">{role.name}</h4>
                  <p className="text-sm text-[#8888aa]">{role.requirements}</p>
                </div>
              ))}
            </div>
          </section>

          {/* XP & POAP Sources */}
          <section>
            <h3 className="text-[10px] font-pixel mb-3 flex items-center gap-2 neon-text-gold">
              <Trophy className="w-4 h-4" />
              {t('xpPoapSources')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {xpPoapSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-2 border-3 border-[#2a2a4e] bg-[#12121a]">
                  <span className="text-sm">{source.source}</span>
                  <div className="flex gap-1">
                    {source.xp && <span className="text-[10px] px-2 py-0.5 border-2 border-[#39ff14] text-[#39ff14] font-pixel">XP</span>}
                    {source.poap && <span className="text-[10px] px-2 py-0.5 border-2 border-[#ff00ff] text-[#ff00ff] font-pixel">POAP</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h3 className="text-[10px] font-pixel mb-3 neon-text-yellow flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ffff00]" />
              {t('importantNotes')}
            </h3>
            <div className="p-3 border-3 border-[#ffd700] bg-[#12121a]">
              <ul className="space-y-1">
                {importantNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-[#ffd700] font-pixel">&gt;</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Important Links */}
          <section>
            <h3 className="text-[10px] font-pixel mb-3 neon-text-cyan flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              {t('importantLinks')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {importantLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border-3 border-[#2a2a4e] bg-[#12121a] hover:border-[#00fff7] hover:bg-[#00fff7]/10 transition-all block pixel-button"
                >
                  <span className="text-xs font-pixel text-[#00fff7]">{link.name}</span>
                  <p className="text-[10px] text-[#8888aa] mt-1">{link.description}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EventDetailModal({ 
  event, 
  open, 
  onOpenChange,
  hasAlarm,
  onToggleAlarm 
}: { 
  event: Event | null
  open: boolean
  onOpenChange: (open: boolean) => void
  hasAlarm: boolean
  onToggleAlarm: () => void
}) {
  const { t, formatTimeWithLabel } = useLanguage()
  const getDayName = useDayName()

  if (!event) return null

  const maxXP = event.xpRewards.length > 0 
    ? Math.max(...event.xpRewards.map(r => r.xp))
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
            {event.icon && (
              <div className="relative">
                <img 
                  src={event.icon} 
                  alt={event.name}
                  className="w-16 h-16 border-3 border-[#00fff7] pixel-shadow"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#39ff14]" />
              </div>
            )}
            <div className="flex-1">
              <span className="text-sm font-pixel neon-text-cyan">{event.name}</span>
              {event.isSpecial && (
                <div className="mt-1">
                  <span className="text-[10px] px-2 py-0.5 border-2 border-[#ffd700] text-[#ffd700] font-pixel bg-[#ffd700]/10">
                    ★ SPECIAL EVENT
                  </span>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Time & Day */}
          <div className="flex items-center gap-4 text-base p-3 border-3 border-[#2a2a4e] bg-[#0a0a0f]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00fff7] pulse-neon" />
              <span className="font-pixel text-[#00fff7] text-sm">{formatTimeWithLabel(event.timeUTC)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#ff00ff]" />
              <span className="text-[#ff00ff]">{getDayName(event.day)}</span>
            </div>
          </div>

          {/* Role Requirement */}
          <div className="flex items-center gap-2 p-3 border-3 border-[#2a2a4e] bg-[#0a0a0f]">
            <Users className="w-5 h-5 text-[#8888aa]" />
            <span 
              className="text-sm font-pixel px-3 py-1 border-3"
              style={{ 
                borderColor: event.roleColor,
                color: event.roleColor,
                backgroundColor: event.roleColor + '20'
              }}
            >
              {event.roleReq}
            </span>
          </div>

          {/* Tags */}
          {(event.hasPOAP || event.hasInsight || (event.rewards && event.rewards.length > 0)) && (
            <div className="flex flex-wrap gap-2">
              {event.hasPOAP && (
                <span className="text-[10px] px-3 py-1 border-3 border-[#ff00ff] text-[#ff00ff] font-pixel bg-[#ff00ff]/10">
                  <Star className="w-3 h-3 inline mr-1" /> POAP
                </span>
              )}
              {event.hasInsight && (
                <span className="text-[10px] px-3 py-1 border-3 border-[#00fff7] text-[#00fff7] font-pixel bg-[#00fff7]/10">
                  <Zap className="w-3 h-3 inline mr-1" /> Insight
                </span>
              )}
            </div>
          )}

          {/* XP Rewards */}
          {event.xpRewards.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-[#ffd700]/10 border-3 border-[#ffd700]">
                <h4 className="text-[10px] font-pixel flex items-center gap-2 text-[#ffd700]">
                  <Trophy className="w-4 h-4" />
                  {t('xpRewards')}
                </h4>
                <span className="text-xs font-pixel text-[#ffd700] neon-text-gold">
                  MAX: {maxXP.toLocaleString()} XP
                </span>
              </div>
              <div className="p-2 border-3 border-[#2a2a4e] bg-[#0a0a0f] max-h-40 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {event.xpRewards.map((reward, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-1 hover:bg-[#39ff14]/10">
                      <span className="text-[#8888aa]">{reward.position}</span>
                      <span className="font-bold text-[#39ff14]">
                        {reward.xp > 0 ? `${reward.xp.toLocaleString()} XP` : 'XP'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              className="flex-1 border-3 border-[#00fff7] bg-[#00fff7] text-[#0a0a0f] hover:bg-[#39ff14] hover:border-[#39ff14] font-pixel text-xs pixel-button"
              onClick={() => {
                window.open(event.link || 'https://discord.gg/genlayer', '_blank')
              }}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              {t('joinEvent')}
            </Button>
            
            <Button
              variant="outline"
              className={`border-3 font-pixel text-xs pixel-button ${hasAlarm ? 'border-[#39ff14] bg-[#39ff14]/20 text-[#39ff14]' : 'border-[#ff00ff] text-[#ff00ff] bg-transparent'}`}
              onClick={onToggleAlarm}
            >
              {hasAlarm ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  {t('alarmSet')}
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4 mr-1.5" />
                  {t('setAlarm')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Notification({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%', scale: 0.9 }}
      animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
      exit={{ opacity: 0, y: -50, x: '-50%', scale: 0.9 }}
      className="fixed top-24 left-1/2 z-50 border-4 border-[#39ff14] bg-[#0a0a0f] px-6 py-4 flex items-center gap-3 max-w-sm pixel-shadow"
    >
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#39ff14]" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#39ff14]" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#39ff14]" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#39ff14]" />
      
      <BellRing className="w-6 h-6 text-[#39ff14] animate-pulse" />
      <span className="text-xs font-pixel text-[#39ff14]">{message}</span>
      <button onClick={onClose} className="ml-2 text-[#8888aa] hover:text-[#ff0040] text-xl font-bold">
        ×
      </button>
    </motion.div>
  )
}

function AppContent() {
  const { t, language, formatTimeWithLabel } = useLanguage()
  const getDayName = useDayName()
  
  const [selectedDay, setSelectedDay] = useState<string>(getCurrentUTCDay())
  const [alarmedEvents, setAlarmedEvents] = useState<Set<string>>(new Set())
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set())
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [eventDetailOpen, setEventDetailOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const currentTime = useCurrentTime()
  const nextEvent = getNextEvent()
  const countdown = useCountdown(nextEvent?.timeUTC || '00:00', nextEvent?.day || 'MONDAY')
  const filteredEvents = events.filter(e => e.day === selectedDay)
  const todayEvents = getTodayEvents()

  const alarmEnabled = alarmedEvents.size > 0

  const toggleEventAlarm = useCallback((eventId: string) => {
    setAlarmedEvents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
        setNotification(t('notification.removed'))
      } else {
        newSet.add(eventId)
        setNotification(t('notification.set'))
      }
      return newSet
    })
    setTimeout(() => setNotification(null), 3000)
  }, [t])

  useEffect(() => {
    if (alarmedEvents.size === 0) return

    const checkNotifications = () => {
      const now = new Date()
      const currentDay = DAYS[new Date().getUTCDay()]
      const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()

      events.forEach(event => {
        if (!alarmedEvents.has(event.id)) return
        if (event.day !== currentDay) return

        const [hours, minutes] = event.timeUTC.split(':').map(Number)
        const eventMinutes = hours * 60 + minutes
        const minutesUntil = eventMinutes - nowMinutes

        if (minutesUntil <= 5 && minutesUntil > 0 && !notifiedEvents.has(event.id)) {
          const minuteText = minutesUntil === 1 ? t('minute') : t('minutes')
          setNotification(`[${event.name}] ${t('notification.startsIn')} ${minutesUntil} ${minuteText}!`)
          setNotifiedEvents(prev => new Set(prev).add(event.id))
          setTimeout(() => setNotification(null), 10000)
        }
      })
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 30000)
    return () => clearInterval(interval)
  }, [alarmedEvents, notifiedEvents, t])

  const openEventDetail = useCallback((event: Event) => {
    setSelectedEvent(event)
    setEventDetailOpen(true)
  }, [])

  const getMaxXP = (event: Event): number => {
    return event.xpRewards.length > 0 
      ? Math.max(...event.xpRewards.map(r => r.xp))
      : 0
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-[#e0e0e0] retro-grid relative crt">
      {/* Animated pixel decorations */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00fff7] via-[#ff00ff] to-[#39ff14] opacity-50 z-50" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#39ff14] via-[#ff00ff] to-[#00fff7] opacity-50 z-50" />

      <AnimatePresence>
        {notification && (
          <Notification message={notification} onClose={() => setNotification(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b-4 border-[#00fff7] bg-[#0a0a0f]/95 backdrop-blur-sm relative">
        <PixelDecoration className="top-2 left-4" />
        <PixelDecoration className="top-2 right-4" />
        
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-3 border-[#00fff7] bg-[#12121a] flex items-center justify-center pixel-shadow relative">
                <Bell className="w-6 h-6 text-[#00fff7] pulse-neon" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#39ff14] animate-pulse" />
              </div>
              <div>
                <h1 className="text-[10px] font-pixel neon-text-cyan glitch" data-text={t('app.title')}>
                  {t('app.title')}
                </h1>
                <p className="text-sm text-[#8888aa] mt-1">{t('app.subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Clock Display */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 border-3 border-[#2a2a4e] bg-[#12121a]">
                <Clock className="w-4 h-4 text-[#00fff7]" />
                <span className="text-sm font-mono text-[#00fff7]">{currentTime}</span>
                <span className="text-[10px] font-pixel text-[#ff00ff]">{language === 'id' ? 'WIB' : 'UTC'}</span>
              </div>

              {alarmEnabled && (
                <div className="flex items-center gap-1 text-[10px] px-3 py-2 border-3 border-[#39ff14] text-[#39ff14] bg-[#39ff14]/10 font-pixel">
                  <BellRing className="w-4 h-4 animate-pulse" />
                  <span>{alarmedEvents.size}</span>
                </div>
              )}

              <LanguageToggle />

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 border-3 border-[#ffd700] bg-[#12121a] hover:bg-[#ffd700]/20 pixel-button"
                onClick={() => setRoleModalOpen(true)}
              >
                <Users className="w-4 h-4 text-[#ffd700]" />
                <span className="hidden sm:inline text-[10px] font-pixel text-[#ffd700]">{t('roles')}</span>
              </Button>

              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Clock */}
          <div className="flex sm:hidden items-center gap-2 mt-3 px-3 py-2 border-3 border-[#2a2a4e] bg-[#12121a] w-fit">
            <Clock className="w-4 h-4 text-[#00fff7]" />
            <span className="text-sm font-mono text-[#00fff7]">{currentTime}</span>
            <span className="text-[10px] font-pixel text-[#ff00ff]">{language === 'id' ? 'WIB' : 'UTC'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        
        {/* Next Event - Hero Section */}
        {nextEvent && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="border-4 border-[#00fff7] bg-[#12121a] p-5 relative overflow-hidden pixel-shadow"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#00fff7]" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#00fff7]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#00fff7]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00fff7]" />
            
            {/* Inner corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-r-2 border-b-2 border-[#00fff7]/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-[#00fff7]/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-r-2 border-t-2 border-[#00fff7]/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-l-2 border-t-2 border-[#00fff7]/30" />

            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#ffff00] pulse-neon" />
              <span className="text-[10px] font-pixel text-[#ffff00] uppercase tracking-wider">
                {t('nextEvent')}
              </span>
              {alarmedEvents.has(nextEvent.id) && (
                <span className="ml-auto text-[10px] px-3 py-1 border-2 border-[#39ff14] text-[#39ff14] font-pixel bg-[#39ff14]/10">
                  <Bell className="w-3 h-3 inline mr-1" /> {t('alarmSet')}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {nextEvent.icon && (
                  <div className="relative">
                    <img 
                      src={nextEvent.icon} 
                      alt={nextEvent.name}
                      className="w-16 h-16 border-3 border-[#00fff7] pixel-shadow"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#39ff14] animate-pulse" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-pixel neon-text-cyan mb-2">{nextEvent.name}</h2>
                  <div className="flex items-center gap-4 text-[#8888aa] text-base">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00fff7]" />
                      <span className="text-[#00fff7] font-pixel">{formatTimeWithLabel(nextEvent.timeUTC)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#ff00ff]" />
                      <span className="text-[#ff00ff]">{getDayName(nextEvent.day)}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm font-pixel px-4 py-2 border-3"
                  style={{ 
                    borderColor: nextEvent.roleColor,
                    color: nextEvent.roleColor,
                    backgroundColor: nextEvent.roleColor + '20'
                  }}
                >
                  {nextEvent.roleReq}
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              {[
                { value: countdown.days, label: t('days'), color: '#00fff7' },
                { value: countdown.hours, label: t('hours'), color: '#ff00ff' },
                { value: countdown.minutes, label: t('min'), color: '#39ff14' },
                { value: countdown.seconds, label: t('sec'), color: '#ffd700' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 border-3 border-[#2a2a4e] bg-[#0a0a0f] text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: item.color }} />
                  <div className="text-2xl font-mono font-bold" style={{ color: item.color }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-[#8888aa] mt-1 font-pixel">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* XP Rewards */}
            {nextEvent.xpRewards.length > 0 && (
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between p-2 border-3 border-[#ffd700] bg-[#ffd700]/10">
                  <h4 className="text-[10px] font-pixel flex items-center gap-2 text-[#ffd700]">
                    <Trophy className="w-4 h-4" />
                    <span>{t('xpRewards')}</span>
                  </h4>
                  <span className="text-xs font-pixel text-[#ffd700] neon-text-gold">
                    MAX: {getMaxXP(nextEvent).toLocaleString()} XP
                  </span>
                </div>
                <div className="p-2 border-3 border-[#2a2a4e] bg-[#0a0a0f] max-h-32 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                    {nextEvent.xpRewards.map((reward, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-1 hover:bg-[#39ff14]/10">
                        <span className="text-[#8888aa]">{reward.position}</span>
                        <span className="font-bold text-[#39ff14]">
                          {reward.xp > 0 ? `${reward.xp.toLocaleString()} XP` : 'XP'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 border-3 border-[#00fff7] bg-[#00fff7] text-[#0a0a0f] hover:bg-[#39ff14] hover:border-[#39ff14] font-pixel text-xs pixel-button"
                onClick={() => toggleEventAlarm(nextEvent.id)}
              >
                {alarmedEvents.has(nextEvent.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t('alarmSet')}
                  </>
                ) : (
                  <>
                    <BellRing className="w-4 h-4 mr-2" />
                    {t('setAlarm')}
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="border-3 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff]/20 font-pixel text-xs pixel-button bg-transparent"
                onClick={() => {
                  window.open(nextEvent.link || 'https://discord.gg/genlayer', '_blank')
                }}
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                {t('joinEvent')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Today's Events */}
        <div className="border-4 border-[#ff00ff] bg-[#12121a] p-5 relative pixel-shadow">
          <div className="absolute top-0 left-0 w-4 h-4 bg-[#ff00ff]" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-[#ff00ff]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#ff00ff]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#ff00ff]" />
          
          <div className="flex items-center gap-3 mb-4 border-b-3 border-[#2a2a4e] pb-3">
            <div className="w-8 h-8 border-2 border-[#ff00ff] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#ff00ff]" />
            </div>
            <h3 className="text-[10px] font-pixel neon-text-magenta">{t('todayEvents')} ({todayEvents.length})</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {todayEvents.slice(0, 5).map((event, index) => (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 border-3 border-[#2a2a4e] hover:border-[#ff00ff] hover:bg-[#ff00ff]/5 transition-all cursor-pointer"
                onClick={() => openEventDetail(event)}
              >
                <div className="flex items-center gap-3">
                  {event.icon && (
                    <img 
                      src={event.icon} 
                      alt={event.name}
                      className="w-10 h-10 border-2 border-[#ff00ff]"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  )}
                  <Clock className="w-4 h-4 text-[#8888aa]" />
                  <span className="text-sm text-[#00fff7] font-pixel">{formatTimeWithLabel(event.timeUTC)}</span>
                  <span className="text-base truncate max-w-[120px]">{event.name}</span>
                  {alarmedEvents.has(event.id) && (
                    <Bell className="w-4 h-4 text-[#39ff14] animate-pulse" />
                  )}
                </div>
                <span 
                  className="text-[10px] px-3 py-1 border-2 font-pixel"
                  style={{ 
                    borderColor: event.roleColor,
                    color: event.roleColor,
                  }}
                >
                  {event.roleReq}
                </span>
              </motion.div>
            ))}
            {todayEvents.length === 0 && (
              <div className="p-4 text-center border-3 border-dashed border-[#2a2a4e]">
                <p className="text-sm text-[#8888aa]">[{t('noEventsToday')}]</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Schedule */}
        <div className="border-4 border-[#39ff14] bg-[#12121a] p-5 relative pixel-shadow">
          <div className="absolute top-0 left-0 w-4 h-4 bg-[#39ff14]" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-[#39ff14]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#39ff14]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#39ff14]" />
          
          <div className="flex items-center gap-3 mb-4 border-b-3 border-[#2a2a4e] pb-3">
            <div className="w-8 h-8 border-2 border-[#39ff14] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-[#39ff14]" />
            </div>
            <h3 className="text-[10px] font-pixel neon-text-lime">{t('eventSchedule')}</h3>
          </div>
          
          <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
            <TabsList className="bg-[#0a0a0f] border-3 border-[#2a2a4e] w-full justify-start flex-wrap h-auto gap-0.5 p-1 mb-4">
              {DAYS.map((day) => {
                const isToday = day === getCurrentUTCDay()
                return (
                  <TabsTrigger 
                    key={day} 
                    value={day}
                    className="text-[10px] px-3 py-2 font-pixel data-[state=active]:bg-[#39ff14] data-[state=active]:text-[#0a0a0f]"
                  >
                    {getDayName(day)}
                    {isToday && <span className="ml-2 w-2 h-2 bg-[#ffd700] inline-block animate-pulse" />}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>

          <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-3 border-3 border-[#2a2a4e] hover:border-[#39ff14] hover:bg-[#39ff14]/5 transition-all cursor-pointer"
                onClick={() => openEventDetail(event)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {event.icon && (
                      <img 
                        src={event.icon} 
                        alt={event.name}
                        className="w-12 h-12 border-2 border-[#39ff14] pixel-shadow"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#00fff7]" />
                        <span className="text-sm font-pixel text-[#00fff7]">{formatTimeWithLabel(event.timeUTC)}</span>
                        {event.isSpecial && (
                          <span className="text-[#ffd700] animate-pulse">★</span>
                        )}
                        {alarmedEvents.has(event.id) && (
                          <Bell className="w-4 h-4 text-[#39ff14] animate-pulse" />
                        )}
                      </div>
                      <h4 className="text-base font-bold truncate mt-1">{event.name}</h4>
                      {event.xpRewards.length > 0 && (
                        <div className="text-[10px] text-[#ffd700] mt-1 font-pixel">
                          <Trophy className="w-3 h-3 inline mr-1" />
                          MAX: {getMaxXP(event).toLocaleString()} XP
                        </div>
                      )}
                    </div>
                  </div>

                  <span 
                    className="text-[10px] px-3 py-1 border-2 shrink-0 font-pixel"
                    style={{ 
                      backgroundColor: event.roleColor + '15',
                      color: event.roleColor,
                      borderColor: event.roleColor + '60'
                    }}
                  >
                    {event.roleReq}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Alarms */}
        {alarmedEvents.size > 0 && (
          <div className="border-4 border-[#ffd700] bg-[#12121a] p-5 relative pixel-shadow">
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#ffd700]" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#ffd700]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#ffd700]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#ffd700]" />
            
            <div className="flex items-center gap-3 mb-4 border-b-3 border-[#2a2a4e] pb-3">
              <div className="w-8 h-8 border-2 border-[#ffd700] flex items-center justify-center">
                <BellRing className="w-4 h-4 text-[#ffd700] animate-pulse" />
              </div>
              <h3 className="text-[10px] font-pixel neon-text-gold">{t('myAlarms')} ({alarmedEvents.size})</h3>
            </div>
            <div className="space-y-2">
              {events.filter(e => alarmedEvents.has(e.id)).map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 border-3 border-[#ffd700]/30 bg-[#ffd700]/5 hover:bg-[#ffd700]/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {event.icon && (
                      <img 
                        src={event.icon} 
                        alt={event.name}
                        className="w-10 h-10 border-2 border-[#ffd700]"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                    <Clock className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-sm text-[#ffd700] font-pixel">{formatTimeWithLabel(event.timeUTC)}</span>
                    <span className="text-base">{event.name}</span>
                    <span className="text-[10px] text-[#8888aa]">({getDayName(event.day)})</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[10px] text-[#ff0040] hover:text-[#ff0040] hover:bg-[#ff0040]/10 border-2 border-[#ff0040]/50 font-pixel"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleEventAlarm(event.id)
                    }}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t-4 border-[#2a2a4e] bg-[#0a0a0f] relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00fff7] via-[#ff00ff] to-[#39ff14] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#ffd700]">★</span>
            <p className="text-[10px] font-pixel text-[#8888aa]">
              {t('footer')}
            </p>
            <span className="text-[#ffd700]">★</span>
          </div>
          <p className="text-[10px] text-[#2a2a4e] mt-2 font-pixel">
            PRESS START TO CONTINUE
          </p>
        </div>
      </footer>

      <RoleSystemModal open={roleModalOpen} onOpenChange={setRoleModalOpen} />
      <EventDetailModal
        event={selectedEvent}
        open={eventDetailOpen}
        onOpenChange={setEventDetailOpen}
        hasAlarm={selectedEvent ? alarmedEvents.has(selectedEvent.id) : false}
        onToggleAlarm={() => {
          if (selectedEvent) {
            toggleEventAlarm(selectedEvent.id)
          }
        }}
      />
    </div>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
