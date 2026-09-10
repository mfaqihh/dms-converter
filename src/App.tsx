import { useState } from 'react'
import { MapView } from './components/Map/MapView'
import { FloatingButton } from './components/FloatingButton/FloatingButton'
import { ConversionForm } from './components/ConversionForm/ConversionForm'
import { useMapPoints } from './hooks/useMapPoints'
import type { DDCoordinate, MapPoint } from './types/coordinate'

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
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <header className="pointer-events-none absolute left-4 top-4 z-10 rounded-lg bg-slate-900/80 px-3 py-2 text-sm text-white shadow">
        <p className="font-semibold">Coordinate Conversion</p>
        <p className="text-xs text-slate-300">DMS ⇄ DD · OpenLayers</p>
      </header>

      <MapView
        points={points}
        onMapClick={handleMapClick}
        onPointClick={handlePointClick}
      />

      <FloatingButton onClick={openForNewPoint} />

      <ConversionForm
        key={formSessionId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddToMaps={handleAddToMaps}
        prefill={prefill}
      />
    </div>
  )
}

export default App