import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import Panel from './Panel'
import { LEVELS } from '../binLevels'
import { useSettings } from '../SettingsContext'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getBins } from '../../api'

const NAIROBI = [-1.2921, 36.8219]

// Tells Leaflet to redraw when its container resizes (e.g. sidebar toggled)
function ResizeFix() {
  const map = useMap()

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])

  return null
}

export default function HotspotMap({
  title = 'Waste Hotspot Map',
  heightClass = 'h-80',
  scrollZoom = false,
}) {
  const { levelOf } = useSettings()
  const { data: bins, loading, error } = useFetch(getBins)

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    const counts = { high: 0, medium: 0, low: 0 }
    bins.forEach((b) => counts[levelOf(b.fill)]++)

    body = (
      <>
        <div className={`${heightClass} overflow-hidden rounded-xl`}>
          <MapContainer
            center={NAIROBI}
            zoom={12}
            scrollWheelZoom={scrollZoom}
            className="h-full w-full"
          >
            <ResizeFix />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {bins.map((bin) => {
              const { color, label } = LEVELS[levelOf(bin.fill)]

              return (
                <CircleMarker
                  key={bin.id}
                  center={[bin.lat, bin.lng]}
                  radius={9}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.85,
                    color: bin.smart ? '#ffffff' : color,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <p className="text-sm font-semibold">{bin.name}</p>
                    <p className="text-xs text-gray-300">
                      {bin.fill}% full · {label}
                    </p>
                    {bin.smart && <p className="text-xs text-green-400">Smart bin</p>}
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-300">
          {Object.entries(LEVELS).map(([key, { label, color }]) => (
            <li key={key} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: color }} />
              {label} ({counts[key]})
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-white bg-gray-500" />
            Smart Bin
          </li>
        </ul>
      </>
    )
  }

  return <Panel title={title}>{body}</Panel>
}