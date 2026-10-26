import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const tick = { fontSize: 11, fill: '#9ca3af' }

export default function RateTrendChart({ data }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={tick}
            width={44}
            // Zoom in around the data so small changes are visible
            domain={[
              (min) => Math.max(0, Math.floor(min / 5) * 5 - 5),
              (max) => Math.min(100, Math.ceil(max / 5) * 5 + 5),
            ]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Recycling rate']}
            contentStyle={{
              background: '#17231f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3, fill: '#22c55e', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}