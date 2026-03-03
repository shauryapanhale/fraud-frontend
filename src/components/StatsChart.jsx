import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

export default function StatsChart({ history }) {
  const data = history.map((item, index) => ({
    name: `#${history.length - index}`,
    amount: parseFloat(item.amount),
    fraud: item.prediction === 1 ? 1 : 0,
  }))

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">
        📊 Recent Transaction History
      </h2>

      {/* Amount Chart */}
      <p className="text-sm text-gray-400 mb-2">Transaction Amounts</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.fraud === 1 ? '#EF4444' : '#6366F1'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-6 mt-4 justify-center text-sm text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span> Legitimate
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Fraud
        </span>
      </div>
    </div>
  )
}
