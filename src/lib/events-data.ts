// GenLayer Event Data Types and Constants

export interface XPReward {
  position: string;
  xp: number;
}

export interface Event {
  id: string;
  name: string;
  icon?: string;
  day: string;
  time: string;
  timeUTC: string;
  xpRewards: XPReward[];
  rewards?: string[];
  roleReq: string;
  roleColor: string;
  isSpecial?: boolean;
  hasPOAP?: boolean;
  hasInsight?: boolean;
  link?: string;
}

export interface Role {
  name: string;
  emoji: string;
  requirements: string;
  perks: string;
  color: string;
}

export interface FunctionalRole {
  name: string;
  requirements: string;
  perks: string;
}

export const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;
export const DAYS_ID: Record<string, string> = {
  'MONDAY': 'Senin',
  'TUESDAY': 'Selasa',
  'WEDNESDAY': 'Rabu',
  'THURSDAY': 'Kamis',
  'FRIDAY': 'Jumat',
  'SATURDAY': 'Sabtu',
  'SUNDAY': 'Minggu'
};

// Discord Channel Links
const DISCORD_LINKS = {
  rumbleGartic: 'https://discord.com/channels/1237055789441487021/1348760456310820884',
  aiBlockchain: 'https://discord.com/channels/1237055789441487021/1247792755044782090',
  genfrenQuiz: 'https://discord.com/channels/1237055789441487021/1366010056906379385',
  pokerChess: 'https://discord.com/channels/1237055789441487021/1370344728733814854',
  regionalQuiz: 'https://discord.com/channels/1237055789441487021/1237114587124600933',
  quizIndonesia: 'https://discord.com/channels/1237055789441487021/1358856200187285625',
  quizNigeria: 'https://discord.com/channels/1237055789441487021/1355488122485346315',
  memeNeurocreative: 'https://discord.com/channels/1237055789441487021/1348736285132587100',
  xSpace: 'https://x.com/GenLayer',
  karaoke: 'https://discord.com/channels/1237055789441487021/1340340818367479861',
  others: 'https://discord.com/channels/1237055789441487021/1348760689879154699',
};

// Helper to generate quiz XP rewards
const generateQuizRewards = (): XPReward[] => [
  { position: 'Top 1', xp: 1500 },
  { position: 'Top 2', xp: 1400 },
  { position: 'Top 3', xp: 1300 },
  { position: 'Top 4', xp: 1200 },
  { position: 'Top 5', xp: 1100 },
  { position: 'Top 6-10', xp: 1000 },
  { position: 'Top 11-20', xp: 900 },
  { position: 'Top 21-30', xp: 800 },
];

const generateGarticRewards = (): XPReward[] => [
  { position: 'Top 1', xp: 1500 },
  { position: 'Top 2', xp: 1400 },
  { position: 'Top 3', xp: 1300 },
  { position: 'Top 4', xp: 1200 },
  { position: 'Top 5', xp: 1100 },
  { position: 'Top 6-10', xp: 1000 },
];

const generateSmashKartsRewards = (): XPReward[] => [
  { position: 'Top 1', xp: 1500 },
  { position: 'Top 2', xp: 1400 },
  { position: 'Top 3', xp: 1300 },
  { position: 'Top 4', xp: 1200 },
  { position: 'Top 5', xp: 1000 },
  { position: 'Top 6-8', xp: 750 },
];

export const events: Event[] = [
  // MONDAY
  {
    id: 'mon-ama',
    name: 'GenLayer Community AMA',
    icon: '/icons/ama.png',
    day: 'MONDAY',
    time: '2:00 PM',
    timeUTC: '14:00',
    xpRewards: [],
    rewards: ['Insight', 'POAP'],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    hasPOAP: true,
    hasInsight: true,
    link: DISCORD_LINKS.xSpace,
  },
  {
    id: 'mon-quiz-korean',
    name: 'Quiz Korean',
    icon: '/icons/quiz-korea.png',
    day: 'MONDAY',
    time: '2:45 PM',
    timeUTC: '14:45',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.regionalQuiz,
  },
  {
    id: 'mon-quiz-ukrainian',
    name: 'Quiz Ukrainian',
    icon: '/icons/quiz-ukraine.png',
    day: 'MONDAY',
    time: '6:00 PM',
    timeUTC: '18:00',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.regionalQuiz,
  },
  {
    id: 'mon-smashkarts',
    name: 'SmashKarts (Community/Late Night)',
    icon: '/icons/smashkarts.png',
    day: 'MONDAY',
    time: '7:00 PM',
    timeUTC: '19:00',
    xpRewards: generateSmashKartsRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.others,
  },

  // TUESDAY
  {
    id: 'tue-quiz-nigerian',
    name: 'Quiz Nigerian',
    icon: '/icons/quiz-nigeria.png',
    day: 'TUESDAY',
    time: '12:30 PM',
    timeUTC: '12:30',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.quizNigeria,
  },
  {
    id: 'tue-rumble-gartic',
    name: 'Rumble & Gartic',
    icon: '/icons/gartic-rumble.png',
    day: 'TUESDAY',
    time: '1:00 PM',
    timeUTC: '13:00',
    xpRewards: [
      ...generateGarticRewards(),
      { position: 'Rumble Top 1', xp: 750 },
      { position: 'Rumble Top 2-5', xp: 500 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.rumbleGartic,
  },
  {
    id: 'tue-vibecoding',
    name: 'GenLayer Vibecoding Session',
    icon: '/icons/vibecoding.png',
    day: 'TUESDAY',
    time: '2:00 PM',
    timeUTC: '14:00',
    xpRewards: [],
    rewards: ['Insight'],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    hasInsight: true,
    link: DISCORD_LINKS.others,
  },
  {
    id: 'tue-neurocreative',
    name: 'Neurocreative Content Contest',
    icon: '/icons/meme-contest.png',
    day: 'TUESDAY',
    time: 'Pengumuman',
    timeUTC: '00:00',
    xpRewards: [
      { position: '🥇', xp: 5000 },
      { position: '🥈', xp: 4500 },
      { position: '🥉', xp: 4000 },
      { position: '🏅 4th', xp: 3500 },
      { position: '🏅 5th', xp: 3000 },
      { position: '✨ Honorary', xp: 2000 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.memeNeurocreative,
  },
  {
    id: 'tue-school-quiz',
    name: 'School Knowledge Quiz',
    icon: '/icons/trivia.png',
    day: 'TUESDAY',
    time: '11:00 PM',
    timeUTC: '23:00',
    xpRewards: [
      { position: 'Top 1', xp: 1500 },
      { position: 'Top 2', xp: 1400 },
      { position: 'Top 3', xp: 1300 },
      { position: 'Top 4', xp: 1200 },
      { position: 'Top 5', xp: 1100 },
      { position: 'Top 6-10', xp: 1000 },
      { position: 'Top 11-20', xp: 900 },
      { position: 'Top 21-30', xp: 800 },
      { position: 'Top 31-40', xp: 700 },
      { position: 'Top 41-50', xp: 600 },
      { position: 'Top 51-60', xp: 500 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.others,
  },

  // WEDNESDAY
  {
    id: 'wed-ai-blockchain',
    name: 'AI & Blockchain Brain Game',
    icon: '/icons/trivia.png',
    day: 'WEDNESDAY',
    time: '1:00 PM',
    timeUTC: '13:00',
    xpRewards: [
      { position: 'Top 1-3', xp: 3500 },
      { position: 'Top 4-15', xp: 3000 },
      { position: 'Top 16-30', xp: 2500 },
      { position: 'Top 31-45', xp: 2000 },
      { position: 'Top 46-60', xp: 1750 },
      { position: 'Top 61-75', xp: 1500 },
      { position: 'Top 76-100', xp: 1250 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    isSpecial: true,
    link: DISCORD_LINKS.aiBlockchain,
  },
  {
    id: 'wed-gentalks',
    name: 'GenTalks',
    icon: '/icons/gentalks.png',
    day: 'WEDNESDAY',
    time: '1:30 PM',
    timeUTC: '13:30',
    xpRewards: [],
    rewards: ['Insight', 'POAP'],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    hasPOAP: true,
    hasInsight: true,
    link: DISCORD_LINKS.xSpace,
  },
  {
    id: 'wed-meme-contest',
    name: 'Meme Contest',
    icon: '/icons/meme-contest.png',
    day: 'WEDNESDAY',
    time: 'Pengumuman',
    timeUTC: '00:00',
    xpRewards: [
      { position: '🥇', xp: 2500 },
      { position: '🥈', xp: 2000 },
      { position: '🥉', xp: 1750 },
      { position: '🏅 4th', xp: 1500 },
      { position: '🏅 5th', xp: 1250 },
      { position: 'Honorable', xp: 1000 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.memeNeurocreative,
  },
  {
    id: 'wed-geoguessr',
    name: 'GeoGuessr',
    icon: '/icons/geoguessr.png',
    day: 'WEDNESDAY',
    time: '4:00 PM',
    timeUTC: '16:00',
    xpRewards: [
      { position: 'Top 1', xp: 1500 },
      { position: 'Top 2', xp: 1400 },
      { position: 'Top 3', xp: 1300 },
      { position: 'Top 4', xp: 1200 },
      { position: 'Top 5', xp: 1100 },
      { position: 'Top 6-10', xp: 1000 },
      { position: 'Top 11-20', xp: 750 },
      { position: 'Top 21-30', xp: 500 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.others,
  },

  // THURSDAY
  {
    id: 'thu-smashkarts',
    name: 'Smash Karts (Official)',
    icon: '/icons/smashkarts.png',
    day: 'THURSDAY',
    time: '3:00 PM',
    timeUTC: '15:00',
    xpRewards: generateSmashKartsRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.others,
  },
  {
    id: 'thu-quiz-russian',
    name: 'Quiz Russian',
    icon: '/icons/quiz-russia.png',
    day: 'THURSDAY',
    time: '7:00 PM',
    timeUTC: '19:00',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.regionalQuiz,
  },

  // FRIDAY
  {
    id: 'fri-genfren-quiz',
    name: 'GenFren Quiz',
    icon: '/icons/genfrenquiz.png',
    day: 'FRIDAY',
    time: '3:00 PM',
    timeUTC: '15:00',
    xpRewards: [
      { position: '10/10', xp: 2500 },
      { position: '9/10', xp: 2250 },
      { position: '8/10', xp: 2000 },
      { position: '7/10', xp: 1750 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.genfrenQuiz,
  },
  {
    id: 'fri-quiz-turkish',
    name: 'Quiz Turkish',
    icon: '/icons/quiz-turkey.png',
    day: 'FRIDAY',
    time: '7:00 PM',
    timeUTC: '19:00',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.regionalQuiz,
  },

  // SATURDAY
  {
    id: 'sat-x-space',
    name: 'Community X Space',
    icon: '/icons/gentalks.png',
    day: 'SATURDAY',
    time: '1:00 PM',
    timeUTC: '13:00',
    xpRewards: [],
    rewards: ['GenLayer conversations & updates'],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    hasPOAP: true,
    link: DISCORD_LINKS.xSpace,
  },
  {
    id: 'sat-gartic',
    name: 'Gartic',
    icon: '/icons/gartic.png',
    day: 'SATURDAY',
    time: '2:00 PM',
    timeUTC: '14:00',
    xpRewards: generateGarticRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.rumbleGartic,
  },
  {
    id: 'sat-quiz-indonesian',
    name: 'Quiz Indonesian',
    icon: '/icons/quiz-indonesia.png',
    day: 'SATURDAY',
    time: '2:00 PM',
    timeUTC: '14:00',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.quizIndonesia,
  },
  {
    id: 'sat-quiz-vietnamese',
    name: 'Quiz Vietnamese',
    icon: '/icons/quiz-vietnam.png',
    day: 'SATURDAY',
    time: '2:00 PM',
    timeUTC: '14:00',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.regionalQuiz,
  },
  {
    id: 'sat-karaoke',
    name: 'Community Karaoke & Open Mic Night',
    icon: '/icons/gentalks.png',
    day: 'SATURDAY',
    time: '4:00 PM',
    timeUTC: '16:00',
    xpRewards: [{ position: 'Q&A XP Rewards', xp: 0 }],
    rewards: ['3 random members dapat XP'],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.karaoke,
  },
  {
    id: 'sat-quiz-indian',
    name: 'Quiz Indian',
    icon: '/icons/quiz-india.png',
    day: 'SATURDAY',
    time: '4:00 PM',
    timeUTC: '16:00',
    xpRewards: generateQuizRewards(),
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.regionalQuiz,
  },

  // SUNDAY
  {
    id: 'sun-chesslayer',
    name: 'ChessLayer',
    icon: '/icons/chess.png',
    day: 'SUNDAY',
    time: '1:00 PM',
    timeUTC: '13:00',
    xpRewards: [
      { position: 'Top 1', xp: 2000 },
      { position: 'Top 2', xp: 1750 },
      { position: 'Top 3', xp: 1500 },
      { position: 'Top 4', xp: 1250 },
      { position: 'Top 5', xp: 1000 },
      { position: 'Top 6-10', xp: 750 },
    ],
    roleReq: 'Brain+',
    roleColor: '#a855f7',
    link: DISCORD_LINKS.pokerChess,
  },
  {
    id: 'sun-pokerhands',
    name: 'AllBrains PokerHands',
    icon: '/icons/poker.png',
    day: 'SUNDAY',
    time: '2:00 PM',
    timeUTC: '14:00',
    xpRewards: [
      { position: 'Top 1', xp: 1500 },
      { position: 'Top 2', xp: 1400 },
      { position: 'Top 3', xp: 1300 },
      { position: 'Top 4', xp: 1200 },
      { position: 'Top 5', xp: 1100 },
      { position: 'Top 6-10', xp: 1000 },
      { position: 'Top 11-20', xp: 750 },
      { position: 'Top 21-30', xp: 500 },
    ],
    roleReq: 'Neuron+',
    roleColor: '#f97316',
    link: DISCORD_LINKS.pokerChess,
  },
  {
    id: 'sun-kirka',
    name: 'Kirka',
    icon: '/icons/kirka.png',
    day: 'SUNDAY',
    time: '3:00 PM',
    timeUTC: '15:00',
    xpRewards: [
      { position: 'Top 1', xp: 1500 },
      { position: 'Top 2', xp: 1400 },
      { position: 'Top 3', xp: 1300 },
      { position: 'Top 4', xp: 1200 },
      { position: 'Top 5', xp: 1100 },
      { position: 'Top 6-10', xp: 1000 },
      { position: 'Top 11-20', xp: 750 },
    ],
    roleReq: 'Molecule+',
    roleColor: '#eab308',
    link: DISCORD_LINKS.others,
  },
];

export const roles: Role[] = [
  {
    name: 'Molecule',
    emoji: '🟡',
    requirements: 'Level 1',
    perks: 'Akses semua channel entry-level',
    color: '#eab308',
  },
  {
    name: 'Neuron',
    emoji: '🟠',
    requirements: 'Level 6',
    perks: 'Kirim gambar, Poker tournaments',
    color: '#f97316',
  },
  {
    name: 'Synapse Intern',
    emoji: '',
    requirements: 'Level 16',
    perks: '-',
    color: '#6366f1',
  },
  {
    name: 'Synapse',
    emoji: '',
    requirements: '8 POAPs + Intern + Certified GenFren',
    perks: '#synapse-beats, Birthday channel',
    color: '#6366f1',
  },
  {
    name: 'Brain Intern',
    emoji: '',
    requirements: 'Level 32',
    perks: '-',
    color: '#8b5cf6',
  },
  {
    name: 'Brain',
    emoji: '🟣',
    requirements: '16 POAPs + Intern + Certified GenFren + Neurocreative',
    perks: '#brain-chat, #genviews, Chess tournaments',
    color: '#a855f7',
  },
  {
    name: 'Singularity Intern',
    emoji: '',
    requirements: 'Level 46',
    perks: '-',
    color: '#ec4899',
  },
  {
    name: 'Singularity',
    emoji: '⭐',
    requirements: '28 POAPs + Application + Neurocreative + Certified GenFren',
    perks: '#singularity-chat, Vote contests, Special Badge',
    color: '#f43f5e',
  },
];

export const functionalRoles: FunctionalRole[] = [
  {
    name: 'Neurocreative',
    requirements: '8+ quality X posts OR Top 5 Content Contest OR 3+ Honorary',
    perks: '#neurocreatives channel',
  },
  {
    name: 'Neurohost',
    requirements: 'Application',
    perks: '#Neurohost coordination',
  },
  {
    name: 'Certified GenFren',
    requirements: '10/10 GenFren Quiz',
    perks: 'Special Badge (1 minggu)',
  },
  {
    name: 'Neurobuilder',
    requirements: 'Opt-in di #role-info',
    perks: 'Builder channels',
  },
  {
    name: 'Neurotweets',
    requirements: 'Opt-in di #role-info',
    perks: 'Notif X posts',
  },
  {
    name: 'Neurogamer',
    requirements: 'Opt-in di #role-info',
    perks: 'Notif games & events',
  },
];

export const xpPoapSources = [
  { source: 'Quizzes & Games', xp: true, poap: false },
  { source: 'Contests (Meme/Content)', xp: true, poap: false },
  { source: 'AMA Discord', xp: false, poap: true },
  { source: 'GenTalks', xp: false, poap: true },
  { source: 'X Livestreams/Spaces', xp: false, poap: true },
  { source: 'Special Events', xp: true, poap: true },
  { source: 'Monthly Contributor Highlights', xp: true, poap: false },
  { source: 'Discord Chat', xp: false, poap: false },
];

export const monthlyContributorHighlights = [
  { category: 'Onboarding & Community', rewards: [5000, 4500, 4000, 3000, 2000] },
  { category: 'Events', rewards: [5000, 4500, 4000, 3000, 2000] },
  { category: 'Builders', rewards: [5000, 4500, 4000, 3000, 2000] },
  { category: 'Content', rewards: [5000, 4500, 4000, 3000, 2000] },
];

export const importantLinks = [
  { name: 'Event Calendar', url: '#today-at-genlayer', description: '#today-at-genlayer' },
  { name: 'Announcements', url: '#announcements', description: '#announcements' },
  { name: 'POAP App iOS', url: 'https://apps.apple.com/tc/app/poap-home/id6478871538', description: 'Download POAP untuk iOS' },
  { name: 'POAP App Android', url: 'https://play.google.com/store/apps/details?id=xyz.poap.mobile.app', description: 'Download POAP untuk Android' },
  { name: 'Developer Docs', url: 'https://docs.genlayer.com/', description: 'Dokumentasi developer' },
  { name: 'GenLayer Studio', url: 'https://studio.genlayer.com/contracts', description: 'Smart Contract Studio' },
  { name: 'X Community', url: 'https://x.com/i/communities/2006334000076406822', description: 'Komunitas X GenLayer' },
];

export const importantNotes = [
  'Cek #today-at-genlayer setiap hari untuk jadwal update',
  'Cek #announcements untuk pembatalan event (AMA bisa dibatalkan)',
  'POAP minimal: Synapse (8), Brain (16), Singularity (28)',
  'Certified GenFren diperlukan untuk role Synapse, Brain, dan Singularity',
  'Neurocreative role diperlukan untuk Brain dan Singularity',
  'Singularity applications dibuka minggu terakhir setiap bulan (max 2 member/bulan)',
  'Nickname harus sama dengan Discord untuk event game (SmashKarts, Kirka, GeoGuessr, dll)',
  'Screenshot leaderboard diperlukan jika nickname tidak match',
  'Multiple rooms tersedia untuk event besar (EU/Asia servers)',
  'Monthly Contributor Highlights - 4 kategori (Onboarding, Events, Builders, Content) - Max 5000 XP',
];

// Get current day events
export function getTodayEvents(): Event[] {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const today = days[new Date().getUTCDay()];
  return events.filter(e => e.day === today);
}

// Get events by day
export function getEventsByDay(day: string): Event[] {
  return events.filter(e => e.day === day);
}

// Calculate next event
export function getNextEvent(): Event | null {
  const now = new Date();
  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  // Check today's events first
  const todayEvents = getEventsByDay(days[currentDay]);
  for (const event of todayEvents) {
    const [hours, minutes] = event.timeUTC.split(':').map(Number);
    const eventTimeInMinutes = hours * 60 + minutes;
    if (eventTimeInMinutes > currentTimeInMinutes) {
      return event;
    }
  }

  // Check next days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDay + i) % 7;
    const nextDayEvents = getEventsByDay(days[nextDayIndex]);
    if (nextDayEvents.length > 0) {
      // Return earliest event of that day
      return nextDayEvents.sort((a, b) => {
        const [hA, mA] = a.timeUTC.split(':').map(Number);
        const [hB, mB] = b.timeUTC.split(':').map(Number);
        return (hA * 60 + mA) - (hB * 60 + mB);
      })[0];
    }
  }

  return null;
}
