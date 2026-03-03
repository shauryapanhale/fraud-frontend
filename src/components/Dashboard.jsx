import { useState } from 'react'
import FraudForm from './FraudForm'
import ResultCard from './ResultCard'
import StatsChart from './StatsChart'

export default function Dashboard() {
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const handleResult = (data) => {
    setResult(data)
    setHistory(prev => [data, ...prev.slice(0, 9)])
  }

  const handleReset = () => setResult(null)

  if (result) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <ResultCard result={result} />
          <button
            onClick={handleReset}
            className="w-full mt-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition text-sm"
          >
            🔄 Check Another Transaction
          </button>
        </div>
        {history.length > 1 && (
          <div className="w-full max-w-2xl mt-10">
            <StatsChart history={history} />
          </div>
        )}
      </div>
    )
  }

  return <FraudForm onResult={handleResult} />
}
