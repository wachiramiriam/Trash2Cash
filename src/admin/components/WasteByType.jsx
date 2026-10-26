import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import Panel from './Panel'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getWasteByType } from '../../api'

export default function WasteByType() {
  const { data, loading, error } = useFetch(getWasteByType)

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    const total = data.reduce((sum, d) => sum + d.kg, 0)

    body = (
      <div className="flex flex-wrap items-center gap-4">
        {/* Donut with total in the middle */}
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="kg"
                nameKey="label"
                innerRadius="62%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.id} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} kg`, name]}
                contentStyle={{
                  background: '#17231f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e5e7eb',
                }}
                itemStyle={{ color: '#e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{total.toLocaleString()}</span>
            <span className="text-xs text-gray-400">kg</span>
          </div>
        </div>

        {/* Legend */}
        <ul className="min-w-[10rem] flex-1 space-y-2 text-xs">
          {data.map((d) => (
            <li key={d.id} className="flex items-center gap-2 text-gray-300">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="flex-1">{d.label}</span>
              <span className="text-gray-400">
                {Math.round((d.kg / total) * 100)}% ({d.kg} kg)
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return <Panel title="Waste by Type">{body}</Panel>
}