import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export default function WeeklyChart({ data }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            domain={[0, 8]}
            ticks={[0, 2, 4, 6, 8]}
          />
          <Bar dataKey="items" fill="#2e9b2e" radius={[4, 4, 0, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}