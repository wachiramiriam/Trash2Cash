import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { WASTE_TYPES } from '../WasteTypes'

const tick = { fontSize: 11, fill: '#9ca3af' }
const formatK = (v) => (v >= 1000 ? `${v / 1000}K` : v)

export default function WasteStackedChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} />
          <YAxis axisLine={false} tickLine={false} tick={tick} width={44} tickFormatter={formatK} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            formatter={(value, name) => [`${value.toLocaleString()} kg`, name]}
            contentStyle={{
              background: '#17231f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
          />
          {WASTE_TYPES.map((t, i) => (
            <Bar
              key={t.id}
              dataKey={t.id}
              name={t.label}
              stackId="waste"
              fill={t.color}
              radius={i === WASTE_TYPES.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}