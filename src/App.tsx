import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search,
  Star, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  Apple,
  Dog,
  IceCream,
  Rocket,
  Play,
  LayoutGrid,
  Brain,
  Clock,
  MapPin,
  Layers,
  Zap,
  TrendingUp,
  CircleHelp,
  Timer,
  FastForward
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- Types ---
type View = 'dashboard' | 'lesson' | 'finish';

interface Question {
  id: number;
  text: string;
  uzText: string;
  options: string[];
  correctIndex: number;
}

interface TopicData {
  id: string;
  title: string;
  uzTitle: string;
  description: string;
  uzDescription: string;
  color: string;
  icon: React.ReactNode;
  category: string;
  content: {
    formula?: string;
    rules: { en: string; uz: string }[];
  };
  questions: Question[];
}

// --- Data ---
const TOPICS: TopicData[] = [
  { 
    id: 'was-were', 
    title: 'Was / Were', 
    uzTitle: 'O\'tgan Zamon (Was / Were)',
    description: 'Learn how to talk about the past using the verb "to be".',
    uzDescription: '"To be" fe\'lining o\'tgan zamon shakllarini o\'rganing.',
    color: 'bg-[#ff9933]', 
    icon: <Timer className="w-6 h-6" />,
    category: 'PAST SIMPLE',
    content: {
      formula: "Subject + was/were + Noun/Adjective + Time",
      rules: [
        { en: "Use 'Was' for I, He, She, It. 👤", uz: "'Was' - Men, U (erkak/ayol/narsa) uchun." },
        { en: "Use 'Were' for You, We, They. 👥", uz: "'Were' - Siz, Biz, Ular uchun." }
      ]
    },
    questions: [
      { id: 1, text: "I _____ at home yesterday.", uzText: "Men kecha uyda edim.", options: ["was", "were"], correctIndex: 0 },
      { id: 2, text: "They _____ happy last night.", uzText: "Ular kecha xursand edilar.", options: ["was", "were"], correctIndex: 1 },
      { id: 3, text: "She _____ a teacher 5 years ago.", uzText: "U 5 yil oldin o'qituvchi edi.", options: ["was", "were"], correctIndex: 0 },
      { id: 4, text: "We _____ in the park.", uzText: "Biz bog'da edik.", options: ["was", "were"], correctIndex: 1 },
      { id: 5, text: "It _____ very cold this morning.", uzText: "Bugun ertalab juda sovuq edi.", options: ["was", "were"], correctIndex: 0 },
    ]
  },
  { 
    id: 'present-continuous', 
    title: 'Present Continuous', 
    uzTitle: 'Hozirgi Davomli Zamon',
    description: 'Talking about actions happening right now.',
    uzDescription: 'Ayni damda sodir bo\'layotgan ish-harakatlar.',
    color: 'bg-[#00d1d1]', 
    icon: <FastForward className="w-6 h-6" />,
    category: 'GRAMMAR',
    content: {
      formula: "Subject + am/is/are + Verb-ing + Time",
      rules: [
        { en: "Use am/is/are + verb-ing. 🏃‍♂️", uz: "am/is/are + fe'l-ing shaklini ishlating." },
        { en: "I am, He/She/It is, You/We/They are.", uz: "Men - am, U - is, Siz/Biz/Ular - are." }
      ]
    },
    questions: [
      { id: 1, text: "I am _____ a book now.", uzText: "Men hozir kitob o'qiyapman.", options: ["read", "reading", "reads"], correctIndex: 1 },
      { id: 2, text: "They are _____ football.", uzText: "Ular futbol o'ynashyapti.", options: ["play", "playing", "plays"], correctIndex: 1 },
      { id: 3, text: "She _____ eating an apple.", uzText: "U olma yeyapti.", options: ["am", "is", "are"], correctIndex: 1 },
      { id: 4, text: "We _____ watching TV.", uzText: "Biz televizor ko'ryapmiz.", options: ["am", "is", "are"], correctIndex: 2 },
      { id: 5, text: "The dog is _____.", uzText: "It yuguryapti.", options: ["run", "running", "runs"], correctIndex: 1 },
    ]
  },
  { 
    id: 'future-simple', 
    title: 'Future Simple (Will)', 
    uzTitle: 'Kelasi Oddiy Zamon',
    description: 'Talking about future plans and predictions.',
    uzDescription: 'Kelajakdagi rejalar va bashoratlar haqida gapirish.',
    color: 'bg-[#a34dff]', 
    icon: <Rocket className="w-6 h-6" />,
    category: 'FUTURE',
    content: {
      formula: "Subject + will + Verb (base) + Time",
      rules: [
        { en: "Use 'Will' + base verb for all subjects. 🚀", uz: "Barcha shaxslar uchun 'Will' + fe'lning asosi." },
        { en: "Use 'Will not' or 'Won't' for negative.", uz: "Inkor shakli uchun 'Will not' yoki 'Won't'." }
      ]
    },
    questions: [
      { id: 1, text: "I _____ visit my grandma tomorrow.", uzText: "Men ertaga buvimni ko'rgani boraman.", options: ["will", "was", "am"], correctIndex: 0 },
      { id: 2, text: "They _____ play tennis next week.", uzText: "Ular kelasi hafta tennis o'ynashadi.", options: ["will", "are", "do"], correctIndex: 0 },
      { id: 3, text: "It _____ rain tonight.", uzText: "Bugun tunda yomg'ir yog'adi.", options: ["will", "is", "does"], correctIndex: 0 },
      { id: 4, text: "She _____ not come to the party.", uzText: "U bazmga kelmaydi.", options: ["will", "is", "do"], correctIndex: 0 },
      { id: 5, text: "Will you _____ me?", uzText: "Menga yordam berasizmi?", options: ["help", "helping", "helped"], correctIndex: 0 },
    ]
  },
  { 
    id: 'comparative-superlative', 
    title: 'Comparative & Superlative', 
    uzTitle: 'Solishtirma va Orttirma',
    description: 'Comparing things using -er and -est.',
    uzDescription: 'Narsalarni -er va -est yordamida solishtirish.',
    color: 'bg-[#4d79ff]', 
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'ADJECTIVES',
    content: {
      formula: "Noun 1 + Verb + Adjective-er + than + Noun 2",
      rules: [
        { en: "Comparative: -er than (Bigger than). 🐘 > 🐕", uz: "Solishtirma: -er than (Kattaroq)." },
        { en: "Superlative: the -est (The biggest). 🐘 #1", uz: "Orttirma: the -est (Eng kattasi)." }
      ]
    },
    questions: [
      { id: 1, text: "A plane is _____ than a car.", uzText: "Samolyot mashinadan tezroq.", options: ["fast", "faster", "fastest"], correctIndex: 1 },
      { id: 2, text: "Mount Everest is the _____ mountain.", uzText: "Everest eng baland tog'.", options: ["high", "higher", "highest"], correctIndex: 2 },
      { id: 3, text: "My brother is _____ than me.", uzText: "Akam mendan kuchliroq.", options: ["strong", "stronger", "strongest"], correctIndex: 1 },
      { id: 4, text: "This is the _____ book in the library.", uzText: "Bu kutubxonadagi eng yaxshi kitob.", options: ["good", "better", "best"], correctIndex: 2 },
      { id: 5, text: "Summer is _____ than winter.", uzText: "Yoz qishdan issiqroq.", options: ["hot", "hotter", "hottest"], correctIndex: 1 },
    ]
  },
  { 
    id: 'there-is-are', 
    title: 'There is / There are', 
    uzTitle: 'Bor (Birlik / Ko\'plik)',
    description: 'Learn how to say something exists in English.',
    uzDescription: 'Ingliz tilida narsa borligini aytishni o\'rganing.',
    color: 'bg-[#00d181]', 
    icon: <Dog className="w-6 h-6" />,
    category: 'GRAMMAR',
    content: {
      formula: "There + is/are + Noun + Place",
      rules: [
        { en: "Use 'There is' for ONE thing! 🍎", uz: "'There is' bitta narsa uchun ishlatiladi!" },
        { en: "Use 'There are' for MANY things! 🍎🍎", uz: "'There are' ko'p narsalar uchun ishlatiladi!" }
      ]
    },
    questions: [
      { id: 1, text: "_____ a cat on the mat.", uzText: "Gilam ustida mushuk bor.", options: ["There is", "There are"], correctIndex: 0 },
      { id: 2, text: "_____ five stars in the sky.", uzText: "Osmonda beshta yulduz bor.", options: ["There is", "There are"], correctIndex: 1 },
      { id: 3, text: "_____ a big sun.", uzText: "Katta quyosh bor.", options: ["There is", "There are"], correctIndex: 0 },
      { id: 4, text: "_____ some milk in the glass.", uzText: "Stakanda bir oz sut bor.", options: ["There is", "There are"], correctIndex: 0 },
      { id: 5, text: "_____ many toys in the box.", uzText: "Qutida ko'plab o'yinchoqlar bor.", options: ["There is", "There are"], correctIndex: 1 },
    ]
  },
  { 
    id: 'few-little', 
    title: 'A few / A little', 
    uzTitle: 'Bir nechta / Ozroq',
    description: 'Quantities for countables and uncountables.',
    uzDescription: 'Sanaladigan va sanalmaydigan miqdorlar.',
    color: 'bg-[#ff4d4d]', 
    icon: <Apple className="w-6 h-6" />,
    category: 'QUANTITY',
    content: {
      formula: "A few + Countable Noun / A little + Uncountable Noun",
      rules: [
        { en: "A few: Use for things you can COUNT (1, 2, 3...) 🍪", uz: "A few: Sanash mumkin bo'lgan narsalar uchun!" },
        { en: "A little: Use for things you CAN'T count (water, milk...) 🥛", uz: "A little: Sanash mumkin bo'lmagan narsalar uchun!" }
      ]
    },
    questions: [
      { id: 1, text: "There are _____ birds in the tree.", uzText: "Daraxtda bir nechta qushlar bor.", options: ["a few", "a little"], correctIndex: 0 },
      { id: 2, text: "Can I have _____ water, please?", uzText: "Iltimos, ozroq suv bersangiz?", options: ["a few", "a little"], correctIndex: 1 },
      { id: 3, text: "I have _____ toys in my box.", uzText: "Qutimda bir nechta o'yinchoqlar bor.", options: ["a few", "a little"], correctIndex: 0 },
      { id: 4, text: "Add _____ salt to the soup.", uzText: "Sho'rvaga ozroq tuz qo'shing.", options: ["a few", "a little"], correctIndex: 1 },
      { id: 5, text: "I saw _____ friends today.", uzText: "Bugun bir nechta do'stlarimni ko'rdim.", options: ["a few", "a little"], correctIndex: 0 },
    ]
  },
  { 
    id: 'how-much-many', 
    title: 'How much / many', 
    uzTitle: 'Qancha? / Nechta?',
    description: 'Asking questions about quantity and amount.',
    uzDescription: 'Miqdor va hajm haqida savollar berish.',
    color: 'bg-[#ffcc00]', 
    icon: <CircleHelp className="w-6 h-6" />,
    category: 'QUESTIONS',
    content: {
      formula: "How many + Countable? / How much + Uncountable?",
      rules: [
        { en: "How many?: Ask about things you can COUNT! 🧸", uz: "How many?: Sanash mumkin bo'lgan narsalar haqida so'rash!" },
        { en: "How much?: Ask about things you CAN'T count! 🍯", uz: "How much?: Sanash mumkin bo'lmagan narsalar haqida so'rash!" }
      ]
    },
    questions: [
      { id: 1, text: "_____ books are on the shelf?", uzText: "Tokchada nechta kitob bor?", options: ["How many", "How much"], correctIndex: 0 },
      { id: 2, text: "_____ juice is in the bottle?", uzText: "Shishada qancha sharbat bor?", options: ["How many", "How much"], correctIndex: 1 },
      { id: 3, text: "_____ friends are at the party?", uzText: "Bazmda nechta do'stlar bor?", options: ["How many", "How much"], correctIndex: 0 },
      { id: 4, text: "_____ money do you need?", uzText: "Sizga qancha pul kerak?", options: ["How many", "How much"], correctIndex: 1 },
      { id: 5, text: "_____ apples did you buy?", uzText: "Siz nechta olma sotib oldingiz?", options: ["How many", "How much"], correctIndex: 0 },
    ]
  }
];

// --- Components ---

const QuizSection = ({ questions, onFinish }: { questions: Question[], onFinish: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      onFinish(score);
    }
  };

  const q = questions[currentIdx];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-[#00d181] font-bold text-sm uppercase tracking-wider">
          SAVOL {currentIdx + 1} / {questions.length}
        </span>
        <h3 className="text-2xl font-bold mt-4 text-white">{q.text}</h3>
        <p className="text-gray-500 italic mt-1">({q.uzText})</p>
      </div>

      <div className="grid gap-3">
        {q.options.map((opt, idx) => {
          let statusClass = "";
          if (isAnswered) {
            if (idx === q.correctIndex) statusClass = "correct";
            else if (idx === selectedIdx) statusClass = "wrong";
            else statusClass = "opacity-40";
          } else if (selectedIdx === idx) {
            statusClass = "selected";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`quiz-option-dark ${statusClass}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === q.correctIndex && <CheckCircle2 className="w-5 h-5" />}
              {isAnswered && idx === selectedIdx && idx !== q.correctIndex && <XCircle className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextQuestion}
          className="w-full btn-najot mt-4"
        >
          {currentIdx === questions.length - 1 ? "NATIJANI KO'RISH" : "KEYINGI SAVOL"}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quizScore, setQuizScore] = useState(0);

  const filteredTopics = useMemo(() => {
    return TOPICS.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.uzTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const startLesson = (topic: TopicData) => {
    setSelectedTopic(topic);
    setView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDashboard = () => (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-12">
        <div className="flex justify-center">
          <div className="bg-[#121212] p-6 rounded-3xl border border-[#222] shadow-2xl relative">
            <div className="absolute inset-0 bg-[#00d181] blur-3xl opacity-10 rounded-full"></div>
            <Zap className="w-16 h-16 text-[#00d181] relative z-10" />
          </div>
        </div>
        <h1 className="text-7xl font-black tracking-tighter leading-none">
          NAJOT <span className="text-[#00d181]">ENGLISH</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
          {TOPICS.length} ta eng zo'r va chiroyli mavzular to'plami. O'zingizga yoqqanini tanlang va o'rganing.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00d181] transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Mavzu qidirish..." 
            className="najot-input text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTopics.map((topic) => (
          <motion.div 
            key={topic.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="najot-card group"
            onClick={() => startLesson(topic)}
          >
            <div className={`najot-card-icon ${topic.color}`}>
              {topic.icon}
            </div>
            <div className="space-y-4 pt-8">
              <div>
                <h3 className="text-[#00d181] font-bold text-xl group-hover:text-white transition-colors">
                  {topic.uzTitle}
                </h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                  {topic.uzDescription}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#222]">
                <span className="text-gray-600 text-[10px] font-black tracking-[0.2em] uppercase">
                  {topic.category}
                </span>
                <div className="bg-[#1a1a1a] p-2 rounded-full text-gray-600 group-hover:bg-[#00d181] group-hover:text-black transition-all">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderLesson = () => {
    if (!selectedTopic) return null;
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 font-bold tracking-wider text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          ORQAGA QAYTISH
        </button>

        <div className="lesson-content space-y-8">
          <div className="flex items-center gap-4">
            <div className={`p-5 rounded-2xl ${selectedTopic.color} text-white shadow-xl`}>
              {selectedTopic.icon}
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#00d181] tracking-tight">{selectedTopic.uzTitle}</h2>
              <p className="text-gray-500 font-medium">{selectedTopic.title}</p>
            </div>
          </div>

          <div className="space-y-4">
            {selectedTopic.content.formula && (
              <div className="bg-[#00d1811a] p-6 rounded-2xl border border-[#00d18133] mb-6">
                <p className="text-[#00d181] font-black text-[10px] uppercase tracking-[0.2em] mb-3">GAP TARKIBI (FORMULA)</p>
                <p className="text-white font-mono text-lg md:text-xl break-words">{selectedTopic.content.formula}</p>
              </div>
            )}
            {selectedTopic.content.rules.map((rule, idx) => (
              <div key={idx} className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#222] hover:border-[#333] transition-colors">
                <p className="text-white font-black text-xl mb-3">{rule.en}</p>
                <p className="text-gray-500 italic font-medium">({rule.uz})</p>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-[#222]">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#00d1811a] p-2 rounded-lg">
                <Brain className="w-6 h-6 text-[#00d181]" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                BILIMINGIZNI SINAB KO'RING
              </h3>
            </div>
            <QuizSection 
              questions={selectedTopic.questions}
              onFinish={(score) => {
                setQuizScore(score);
                setView('finish');
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderFinish = () => {
    if (!selectedTopic) return null;
    const percentage = Math.round((quizScore / selectedTopic.questions.length) * 100);
    
    // Smiley logic
    let smiley = "🤩";
    if (percentage < 20) smiley = "😭";
    else if (percentage < 40) smiley = "😟";
    else if (percentage < 60) smiley = "😐";
    else if (percentage < 80) smiley = "🙂";
    else if (percentage < 100) smiley = "😎";

    const data = [
      { name: 'Correct', value: percentage },
      { name: 'Remaining', value: 100 - percentage },
    ];

    const COLORS = ['#00d181', '#1a1a1a'];

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto py-20 text-center space-y-10"
      >
        <div className="flex justify-center relative">
          <div className="w-72 h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={percentage === 100 || percentage === 0 ? 0 : 5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  cornerRadius={10}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="text-7xl mb-2"
              >
                {smiley}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-black text-white"
              >
                {percentage}%
              </motion.span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-6xl font-black text-white tracking-tighter">NATIJA 🎉</h2>
          <p className="text-4xl font-black text-[#00d181]">
            TO'G'RI JAVOBLAR: {quizScore} / {selectedTopic.questions.length}
          </p>
          <p className="text-gray-400 text-lg max-w-md mx-auto font-medium leading-relaxed">
            Siz "{selectedTopic.uzTitle}" mavzusini muvaffaqiyatli yakunladingiz. O'rganishda davom eting!
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <button 
            onClick={() => setView('dashboard')}
            className="btn-najot w-full py-4 text-lg"
          >
            <LayoutGrid className="w-5 h-5" />
            BOSHQA MAVZULAR
          </button>
          <button 
            onClick={() => {
              setQuizScore(0);
              setView('lesson');
            }}
            className="text-gray-500 hover:text-white transition-colors font-bold tracking-widest text-xs"
          >
            QAYTADAN BOSHLASH
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen px-4 md:px-8 bg-[#0a0a0a]">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderDashboard()}
          </motion.div>
        )}
        {view === 'lesson' && (
          <motion.div 
            key="lesson"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderLesson()}
          </motion.div>
        )}
        {view === 'finish' && (
          <motion.div 
            key="finish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderFinish()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-[#1a1a1a] text-center mt-20">
        <div className="flex justify-center mb-6">
          <Rocket className="w-8 h-8 text-gray-800" />
        </div>
        <p className="text-gray-700 text-[10px] font-black tracking-[0.4em] uppercase">
          © 2026 NAJOT ENGLISH • KELAJAKNI O'RGANING
        </p>
      </footer>
    </div>
  );
}
