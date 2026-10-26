import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Panel from './Panel'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getCollectionTrend } from '../../api'

const formatK = (v) => (v >= 1000 ? `${v / 1000}K` : v)
const tick = { fontSize: 11, fill: '#9ca3af' }

export default function CollectionTrend() {
  const { data, loading, error } = useFetch(getCollectionTrend)

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    body = (
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={tick} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={tick}
              width={40}
              allowDecimals={false}
              domain={[0, (max) => Math.ceil(max / 500) * 500]}
              tickFormatter={formatK}
            />
            <Tooltip
              formatter={(value) => [`${value.toLocaleString()} kg`, 'Collected']}
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
              dataKey="kg"
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

  return (
    <Panel title="Waste Collection Trend" action={<span className="text-xs text-gray-400">kg</span>}>
      {body}
    </Panel>
  )
}