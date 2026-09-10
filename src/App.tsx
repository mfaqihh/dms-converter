import { useState } from 'react'
import { MapView } from './components/Map'
import { FloatingButton } from './components/FloatingButton'
import { ConversionForm } from './components/ConversionForm'
import { useMapPoints } from './hooks/useMapPoints'
import type { DDCoordinate, MapPoint } from './types/coordinate'
import { MapPin } from 'lucide-react'
import './App.css'

function App() {
  const { points, addPoint, updatePoint } = useMapPoints()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPointId, setEditingPointId] = useState<string | null>(null)
  const [prefill, setPrefill] = useState<DDCoordinate | undefined>(undefined)
  const [formSessionId, setFormSessionId] = useState(0)

  const openForNewPoint = () => {
    setEditingPointId(null)
    setPrefill(undefined)
    setFormSessionId((id) => id + 1)
    setIsFormOpen(true)
  }

  const handleMapClick = (lon: number, lat: number) => {
    setEditingPointId(null)
    setPrefill({ latitude: lat, longitude: lon })
    setFormSessionId((id) => id + 1)
    setIsFormOpen(true)
  }

  const handlePointClick = (point: MapPoint) => {
    setEditingPointId(point.id)
    setPrefill(point.coordinate)
    setFormSessionId((id) => id + 1)
    setIsFormOpen(true)
  }

  const handleAddToMaps = (coordinate: DDCoordinate) => {
    if (editingPointId) {
      updatePoint(editingPointId, coordinate)
    } else {
      addPoint(coordinate)
    }
    setIsFormOpen(false)
    setEditingPointId(null)
    setPrefill(undefined)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* ── Brand badge ── */}
      <header className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/80 px-4 py-2.5 shadow-xl backdrop-blur-md">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black shadow">
            <MapPin aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold leading-none text-white">DMS Converter</p>
            <p className="mt-0.5 text-[10px] leading-none text-zinc-400">OpenLayers</p>
          </div>
        </div>

        {/* Point counter */}
        {points.length > 0 && (
          <div className="animate-fade-in self-start rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {points.length} point{points.length > 1 ? 's' : ''} on map
          </div>
        )}
      </header>

      <MapView
        points={points}
        onMapClick={handleMapClick}
        onPointClick={handlePointClick}
      />

      <FloatingButton onClick={openForNewPoint} isFormOpen={isFormOpen} />

      <ConversionForm
        key={formSessionId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddToMaps={handleAddToMaps}
        prefill={prefill}
        isEditing={!!editingPointId}
      />
    </div>
  )
}

export default App