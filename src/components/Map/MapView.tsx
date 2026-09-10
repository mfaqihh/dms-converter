import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { fromLonLat, toLonLat } from 'ol/proj'
import type { MapPoint } from '../../types/coordinate'

/**
 * Props for {@link MapView}.
 */
export interface MapViewProps {
  /** Points/markers to render on the map. */
  points: MapPoint[]
  /** Called when the user clicks an empty spot on the map. */
  onMapClick?: (lon: number, lat: number) => void
  /** Called when the user clicks an existing marker. */
  onPointClick?: (point: MapPoint) => void
}

const DEFAULT_CENTER = fromLonLat([113.9213, -0.7893]) // Indonesia-ish default
const DEFAULT_ZOOM = 4

/**
 * Renders an OpenLayers OSM map with a vector layer of point markers.
 *
 * - Clicking an empty area of the map fires `onMapClick` with lon/lat.
 * - Clicking an existing marker fires `onPointClick` with that point.
 * - When `points` changes, the marker layer is redrawn and the view
 *   re-centers on the most recently added point.
 *
 * This component is intentionally presentation-only: it owns no
 * conversion logic, so it can be reused anywhere a map with markers is
 * needed.
 */
export function MapView({ points, onMapClick, onPointClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const vectorSourceRef = useRef<VectorSource>(new VectorSource())

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: '#facc15' }),
          stroke: new Stroke({ color: '#1f2937', width: 2 }),
        }),
      }),
    })

    const map = new Map({
      target: containerRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      }),
    })

    map.on('click', (event) => {
      const clickedFeature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
      )

      if (clickedFeature) {
        const id = clickedFeature.get('pointId') as string | undefined
        const point = points.find((p) => p.id === id)
        if (point && onPointClick) {
          onPointClick(point)
        }
        return
      }

      if (onMapClick) {
        const [lon, lat] = toLonLat(event.coordinate)
        onMapClick(lon, lat)
      }
    })

    mapRef.current = map

    return () => {
      map.setTarget(undefined)
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Redraw markers whenever points change, and recenter on the latest one.
  useEffect(() => {
    const source = vectorSourceRef.current
    source.clear()

    const features = points.map((point) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([point.coordinate.longitude, point.coordinate.latitude]),
        ),
      })
      feature.set('pointId', point.id)
      return feature
    })

    source.addFeatures(features)

    const latest = points[points.length - 1]
    if (latest && mapRef.current) {
      mapRef.current.getView().animate({
        center: fromLonLat([
          latest.coordinate.longitude,
          latest.coordinate.latitude,
        ]),
        duration: 400,
      })
    }
  }, [points])

  return (
    <div
      ref={containerRef}
      data-testid="map-view"
      className="h-full w-full"
    />
  )
}