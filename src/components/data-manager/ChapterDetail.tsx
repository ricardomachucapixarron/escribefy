import React, { useState } from "react";
import { ArrowLeft, Save, FileText, Clock, BarChart3, Tag, Image, Volume2, Play } from "lucide-react";

export interface Chapter {
  id: string;
  title: string;
  synopsis?: string;
  status: string;
  wordCount?: number;
  mood?: string;
  themes?: string[];
  keyEvents?: string[];
  lastModified?: string;
  content?: string;
  audioAssets?: any[];
  imageAssets?: any[];
  mediaMarkers?: any[];
}

interface ChapterDetailProps {
  chapter: Chapter;
  onBack: () => void;
  onSave: (updatedChapter: Chapter) => void;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({ 
  chapter, 
  onBack, 
  onSave 
}) => {
  const [editedChapter, setEditedChapter] = useState<Chapter>({ ...chapter });

  const handleFieldChange = (field: keyof Chapter, value: any) => {
    setEditedChapter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: 'themes' | 'keyEvents', value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    handleFieldChange(field, arrayValue);
  };

  const handleSave = () => {
    onSave(editedChapter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'draft': return 'bg-yellow-600';
      case 'in-progress': return 'bg-blue-600';
      case 'review': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-400" />
            Editar Capítulo
          </h2>
          <p className="text-gray-400 mt-1">ID: {chapter.id}</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Save className="h-5 w-5" />
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información Básica
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Capítulo
                </label>
                <input
                  type="text"
                  value={editedChapter.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Título del capítulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sinopsis
                </label>
                <textarea
                  value={editedChapter.synopsis || ''}
                  onChange={(e) => handleFieldChange('synopsis', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Resumen del capítulo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado
                  </label>
                  <select
                    value={editedChapter.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="draft">Borrador</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="review">En Revisión</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ambiente/Mood
                  </label>
                  <input
                    type="text"
                    value={editedChapter.mood || ''}
                    onChange={(e) => handleFieldChange('mood', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    placeholder="ej: épico, misterioso, romántico"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contenido del Capítulo
            </h3>
            
            <textarea
              value={editedChapter.content || ''}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              rows={20}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 font-mono text-sm"
              placeholder="Contenido del capítulo en Markdown..."
            />
            
            <div className="mt-3 text-sm text-gray-400">
              Palabras: {editedChapter.content ? editedChapter.content.split(/\s+/).length : 0}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estadísticas
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Palabras:</span>
                <span className="text-white">{editedChapter.wordCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(editedChapter.status)}`}>
                  {editedChapter.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Última modificación:</span>
                <span className="text-white text-sm">
                  {editedChapter.lastModified ? new Date(editedChapter.lastModified).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Themes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Temas
            </h3>
            
            <textarea
              value={editedChapter.themes?.join(', ') || ''}
              onChange={(e) => handleArrayFieldChange('themes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="despertar, poder, transformación"
            />
            <p className="text-xs text-gray-500 mt-2">Separar con comas</p>
          </div>

          {/* Key Events */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Eventos Clave
            </h3>
            
            <textarea
              value={editedChapter.keyEvents?.join(', ') || ''}
              onChange={(e) => handleArrayFieldChange('keyEvents', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="Ritual fallido, Explosión de poder, Huida"
            />
            <p className="text-xs text-gray-500 mt-2">Separar con comas</p>
          </div>

          {/* Media Assets */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Assets Multimedia</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">Imágenes</span>
                </div>
                <span className="text-white">{editedChapter.imageAssets?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Audio</span>
                </div>
                <span className="text-white">{editedChapter.audioAssets?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300">Marcadores</span>
                </div>
                <span className="text-white">{editedChapter.mediaMarkers?.length || 0}</span>
              </div>
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Gestionar Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;
