import React from 'react';
import { Plus, Trash2, ImagePlus } from 'lucide-react';

interface LocationPortfolioItem {
  id: string;
  filename: string;
  path: string;
  description: string;
  createdAt?: string;
  vector?: number[];
  prompt?: string;
  tags?: string[];
  mood?: string;
  context?: string;
}

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  significance: string;
  portfolio: LocationPortfolioItem[];
}

interface LocationsFormProps {
  currentData: any;
  updateLocationField: (locIndex: number, field: string, value: any) => void;
  addLocation: () => void;
  removeLocation: (locIndex: number) => void;
  addLocationPortfolioItem: (locIndex: number) => void;
  removeLocationPortfolioItem: (locIndex: number, itemIndex: number) => void;
}

const LocationsForm: React.FC<LocationsFormProps> = ({
  currentData,
  updateLocationField,
  addLocation,
  removeLocation,
  addLocationPortfolioItem,
  removeLocationPortfolioItem,
}) => {
  const locations: Location[] = currentData?.locations || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-400">Lugares del Proyecto</h3>
        <button
          onClick={addLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Agregar Lugar
        </button>
      </div>
      {locations.length === 0 && (
        <div className="text-gray-400 text-center py-8">No hay lugares definidos aún.</div>
      )}
      {locations.map((location, locIndex) => (
        <div key={location.id || locIndex} className="border border-blue-700 rounded-lg p-6 bg-blue-950/40 relative mb-8">
          <button
            onClick={() => removeLocation(locIndex)}
            className="absolute top-3 right-3 text-red-400 hover:text-red-600"
            title="Eliminar lugar"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-blue-300 font-semibold">Nombre</label>
                <input
                  className="w-full rounded bg-blue-900/60 text-white px-3 py-2"
                  value={location.name}
                  onChange={e => updateLocationField(locIndex, 'name', e.target.value)}
                  placeholder="Nombre del lugar"
                />
              </div>
              <div>
                <label className="block text-blue-300 font-semibold">Tipo</label>
                <input
                  className="w-full rounded bg-blue-900/60 text-white px-3 py-2"
                  value={location.type}
                  onChange={e => updateLocationField(locIndex, 'type', e.target.value)}
                  placeholder="Tipo de lugar (ciudad, laboratorio, bosque, etc)"
                />
              </div>
              <div>
                <label className="block text-blue-300 font-semibold">Significado/Narrativa</label>
                <textarea
                  className="w-full rounded bg-blue-900/60 text-white px-3 py-2"
                  value={location.significance}
                  onChange={e => updateLocationField(locIndex, 'significance', e.target.value)}
                  placeholder="Importancia o rol narrativo del lugar"
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-300 font-semibold">Descripción</label>
                <textarea
                  className="w-full rounded bg-blue-900/60 text-white px-3 py-2"
                  value={location.description}
                  onChange={e => updateLocationField(locIndex, 'description', e.target.value)}
                  placeholder="Descripción detallada del lugar"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Portfolio de imágenes */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-blue-300 font-semibold">Portfolio de Imágenes</h4>
              <button
                onClick={() => addLocationPortfolioItem(locIndex)}
                className="ml-2 px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 flex items-center gap-1"
              >
                <ImagePlus className="h-4 w-4" /> Añadir Imagen
              </button>
            </div>
            {location.portfolio?.length === 0 && (
              <div className="text-gray-400 text-sm">Sin imágenes aún.</div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {location.portfolio?.map((item, itemIndex) => (
                <div key={item.id || itemIndex} className="bg-blue-900/50 rounded p-4 relative">
                  <button
                    onClick={() => removeLocationPortfolioItem(locIndex, itemIndex)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      className="w-full rounded bg-blue-950/30 text-white px-2 py-1"
                      value={item.filename}
                      onChange={e => updateLocationField(locIndex, `portfolio.${itemIndex}.filename`, e.target.value)}
                      placeholder="Nombre del archivo"
                    />
                    <input
                      className="w-full rounded bg-blue-950/30 text-white px-2 py-1"
                      value={item.path}
                      onChange={e => updateLocationField(locIndex, `portfolio.${itemIndex}.path`, e.target.value)}
                      placeholder="Ruta de la imagen"
                    />
                    <textarea
                      className="w-full rounded bg-blue-950/30 text-white px-2 py-1"
                      value={item.description}
                      onChange={e => updateLocationField(locIndex, `portfolio.${itemIndex}.description`, e.target.value)}
                      placeholder="Descripción de la imagen"
                      rows={2}
                    />
                    <input
                      className="w-full rounded bg-blue-950/30 text-white px-2 py-1"
                      value={item.prompt || ''}
                      onChange={e => updateLocationField(locIndex, `portfolio.${itemIndex}.prompt`, e.target.value)}
                      placeholder="Prompt (opcional)"
                    />
                    <input
                      className="w-full rounded bg-blue-950/30 text-white px-2 py-1"
                      value={item.tags?.join(', ') || ''}
                      onChange={e => updateLocationField(locIndex, `portfolio.${itemIndex}.tags`, e.target.value.split(',').map(t => t.trim()))}
                      placeholder="Tags (separados por coma)"
                    />
                    <input
                      className="w-full rounded bg-blue-950/30 text-white px-2 py-1"
                      value={item.mood || ''}
                      onChange={e => updateLocationField(locIndex, `portfolio.${itemIndex}.mood`, e.target.value)}
                      placeholder="Mood (opcional)"
                    />
                    <input
                      className="w-full rounded bg-blue-950/30 text-white px-2 py-1"
                      value={item.context || ''}
                      onChange={e => updateLocationField(locIndex, `portfolio.${itemIndex}.context`, e.target.value)}
                      placeholder="Contexto (opcional)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationsForm;
