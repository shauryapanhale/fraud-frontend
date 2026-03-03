import { motion, AnimatePresence } from 'framer-motion'

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500 text-sm">Submit a transaction to see the prediction</p>
      </div>
    )
  }

  const isFraud = result.prediction === 'FRAUDULENT'
  const confidence = result.fraud_probability.toFixed(1)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.prediction + result.amount}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className={`rounded-2xl p-6 shadow-lg border min-h-[300px] flex flex-col justify-between
          ${isFraud
            ? 'bg-red-950 border-red-700'
            : 'bg-green-950 border-green-700'
          }`}
      >
        {/* Status */}
        <div className="text-center">
          <div className="text-6xl mb-4">{isFraud ? '🚨' : '✅'}</div>
          <h2 className={`text-3xl font-bold ${isFraud ? 'text-red-400' : 'text-green-400'}`}>
            {isFraud ? 'FRAUD DETECTED' : 'LEGITIMATE'}
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            Transaction Type: <span className="font-semibold text-white">{result.type}</span>
          </p>
          <p className="text-gray-300 text-sm">
            Amount: <span className="font-semibold text-white">₹{parseFloat(result.amount).toLocaleString()}</span>
          </p>
        </div>

        {/* Confidence Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Confidence</span>
            <span>{confidence}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-3 rounded-full ${isFraud ? 'bg-red-500' : 'bg-green-500'}`}
            />
          </div>
        </div>

        {/* Risk Label */}
        <div className="mt-4 space-y-2 text-center">
  <span className={`text-xs font-semibold px-3 py-1 rounded-full
    ${result.risk_level === 'HIGH'
      ? 'bg-red-800 text-red-200'
      : result.risk_level === 'MEDIUM'
      ? 'bg-yellow-800 text-yellow-200'
      : 'bg-green-800 text-green-200'
    }`}>
    {result.risk_level} RISK
  </span>
  <p className="text-gray-400 text-sm mt-2">{result.message}</p>
</div>
      </motion.div>
    </AnimatePresence>
  )
}
