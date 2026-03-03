import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const steps = [
  {
    key: 'PolicyType',
    question: "Alright, let's start simple — what kind of vehicle are we covering here?",
    hint: 'This helps us understand the type of protection on your policy',
    type: 'select',
    options: [
      'Sedan — Full coverage (All Perils)',
      'Sedan — Collision only',
      'Sedan — Basic liability',
      'Sports car — Full coverage (All Perils)',
      'Sports car — Collision only',
      'Sports car — Basic liability',
      'Utility vehicle — Full coverage (All Perils)',
      'Utility vehicle — Collision only',
      'Utility vehicle — Basic liability',
    ],
    valueMap: {
      'Sedan — Full coverage (All Perils)': 'Sedan - All Perils',
      'Sedan — Collision only': 'Sedan - Collision',
      'Sedan — Basic liability': 'Sedan - Liability',
      'Sports car — Full coverage (All Perils)': 'Sport - All Perils',
      'Sports car — Collision only': 'Sport - Collision',
      'Sports car — Basic liability': 'Sport - Liability',
      'Utility vehicle — Full coverage (All Perils)': 'Utility - All Perils',
      'Utility vehicle — Collision only': 'Utility - Collision',
      'Utility vehicle — Basic liability': 'Utility - Liability',
    },
  },
  {
    key: 'Make',
    question: "Got it. And what brand is the vehicle?",
    hint: "Just the manufacturer — whatever's on the badge",
    type: 'select',
    options: ['Honda', 'Toyota', 'Ford', 'Mazda', 'Chevrolet',
              'Pontiac', 'Accura', 'Dodge', 'Mercury', 'Jaguar',
              'Nisson', 'VW', 'Saab', 'Saturn', 'Porche',
              'BMW', 'Mercedes', 'Ferrari', 'Lexus'],
  },
  {
    key: 'VehiclePrice',
    question: "Roughly, what would you say the car is worth?",
    hint: "Approximate market value at the time of the incident",
    type: 'select',
    options: [
      'Under ₹20,000',
      'Between ₹20,000 – ₹29,000',
      'Between ₹30,000 – ₹39,000',
      'Between ₹40,000 – ₹59,000',
      'Between ₹60,000 – ₹69,000',
      'Over ₹69,000',
    ],
    valueMap: {
      'Under ₹20,000': 'less than 20000',
      'Between ₹20,000 – ₹29,000': '20000 to 29000',
      'Between ₹30,000 – ₹39,000': '30000 to 39000',
      'Between ₹40,000 – ₹59,000': '40000 to 59000',
      'Between ₹60,000 – ₹69,000': '60000 to 69000',
      'Over ₹69,000': 'more than 69000',
    },
  },
  {
    key: 'Deductible',
    question: "Before we go further — how much are you responsible for paying out of pocket?",
    hint: "This is the deductible amount on your policy",
    type: 'select',
    options: ['₹400', '₹500', '₹700', '₹900'],
    valueMap: {
      '₹400': '400',
      '₹500': '500',
      '₹700': '700',
      '₹900': '900',
    },
  },
  {
    key: 'AccidentArea',
    question: "Where exactly did the incident take place?",
    hint: "Think about the surroundings when it happened",
    type: 'select',
    options: [
      '🏙️ In the city or a busy area',
      '🌾 Out in a rural or remote area',
    ],
    valueMap: {
      '🏙️ In the city or a busy area': 'Urban',
      '🌾 Out in a rural or remote area': 'Rural',
    },
  },
  {
    key: 'Fault',
    question: "This is important — who do you believe was responsible for the accident?",
    hint: "Be honest, this is standard procedure for every claim",
    type: 'select',
    options: [
      "It was my fault",
      "The other party was at fault",
    ],
    valueMap: {
      "It was my fault": 'Policy Holder',
      "The other party was at fault": 'Third Party',
    },
  },
  {
    key: 'AgeOfPolicyHolder',
    question: "Just to confirm — how old are you?",
    hint: "Your age group as listed on the policy",
    type: 'select',
    options: ['16 – 17', '18 – 20', '21 – 25', '26 – 30',
              '31 – 35', '36 – 40', '41 – 50', '51 – 65', '65 or older'],
    valueMap: {
      '16 – 17': '16 to 17',
      '18 – 20': '18 to 20',
      '21 – 25': '21 to 25',
      '26 – 30': '26 to 30',
      '31 – 35': '31 to 35',
      '36 – 40': '36 to 40',
      '41 – 50': '41 to 50',
      '51 – 65': '51 to 65',
      '65 or older': 'over 65',
    },
  },
  {
    key: 'DriverRating',
    question: "How would you describe your overall driving record?",
    hint: "Based on your history, experience, and past incidents",
    type: 'select',
    options: [
      '⚠️ Not great — I have had issues before',
      '😐 Below average — a few concerns',
      '🙂 Pretty decent driver',
      '⭐ Clean record, no issues',
    ],
    valueMap: {
      '⚠️ Not great — I have had issues before': '1',
      '😐 Below average — a few concerns': '2',
      '🙂 Pretty decent driver': '3',
      '⭐ Clean record, no issues': '4',
    },
  },
  {
    key: 'PastNumberOfClaims',
    question: "Have you filed any insurance claims before this one?",
    hint: "All previous claims under any policy",
    type: 'select',
    options: [
      "No, this is my first time",
      "Yes, once before",
      "A few times — 2 to 4",
      "Quite a few — more than 4",
    ],
    valueMap: {
      "No, this is my first time": 'none',
      "Yes, once before": '1',
      "A few times — 2 to 4": '2 to 4',
      "Quite a few — more than 4": 'more than 4',
    },
  },
  {
    key: 'Days_Policy_Accident',
    question: "How soon after you got this policy did the accident happen?",
    hint: "Roughly how many days had passed since the policy started",
    type: 'select',
    options: [
      "Same day the policy started",
      "Within the first week (1–7 days)",
      "About 1–2 weeks in (8–15 days)",
      "Around 2–4 weeks in (15–30 days)",
      "More than a month after",
    ],
    valueMap: {
      "Same day the policy started": 'none',
      "Within the first week (1–7 days)": '1 to 7',
      "About 1–2 weeks in (8–15 days)": '8 to 15',
      "Around 2–4 weeks in (15–30 days)": '15 to 30',
      "More than a month after": 'more than 30',
    },
  },
  {
    key: 'Days_Policy_Claim',
    question: "And when did you actually file this claim after getting the policy?",
    hint: "The day you submitted the claim, not the accident date",
    type: 'select',
    options: [
      "Same day the policy started",
      "About 1–2 weeks in (8–15 days)",
      "Around 2–4 weeks in (15–30 days)",
      "More than a month after",
    ],
    valueMap: {
      "Same day the policy started": 'none',
      "About 1–2 weeks in (8–15 days)": '8 to 15',
      "Around 2–4 weeks in (15–30 days)": '15 to 30',
      "More than a month after": 'more than 30',
    },
  },
]


const variants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
}

export default function FraudForm({ onResult }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [direction, setDirection] = useState(1)

  const current = steps[step]
  const progress = (step / steps.length) * 100

  const handleSelect = (val) => {
  const actualValue = current.valueMap ? current.valueMap[val] : val
  const updated = { ...form, [current.key]: actualValue }
  setForm(updated)
  setDirection(1)
  setTimeout(() => setStep((s) => s + 1), 200)
}


  const handleBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/predict`, form, {
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY
  }
})


      onResult({ ...res.data, ...form })
    } catch {
      setError('❌ Failed to connect to backend. Is FastAPI running?')
    } finally {
      setLoading(false)
    }
  }

  // Review Screen
  if (step === steps.length) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-1 text-center">📝 Review Your Claim</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Make sure everything looks correct</p>

          <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
            {steps.map((s) => (
              <div key={s.key} className="flex justify-between text-sm border-b border-gray-800 pb-2">
                <span className="text-gray-400">{s.question.replace(/^.{2} /, '')}</span>
                <span className="text-indigo-300 font-semibold ml-4 text-right">{form[s.key]}</span>
              </div>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition text-sm"
            >
              ← Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : '🔍 Detect Fraud'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Question {step + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="bg-indigo-500 h-1.5 rounded-full"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-md overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{current.question}</h2>
            <p className="text-gray-500 text-sm mb-6">{current.hint}</p>

            <div className="grid grid-cols-1 gap-3">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition text-sm font-medium
                    ${form[current.key] === opt
                      ? 'border-indigo-500 bg-indigo-950 text-indigo-300'
                      : 'border-gray-700 text-gray-300 hover:border-indigo-500 hover:bg-gray-800'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={handleBack}
                className="mt-6 text-sm text-gray-500 hover:text-gray-300 transition"
              >
                ← Back
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
