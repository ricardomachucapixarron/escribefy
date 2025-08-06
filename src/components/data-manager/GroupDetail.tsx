import React from "react";
import { Edit, Users, ArrowLeft, User } from "lucide-react";

export interface Group {
  id: string;
  name: string;
  description?: string;
  type: string;
  color?: string;
  memberCount?: number;
  portfolio?: any[];
}

export interface Character {
  id: string;
  name: string;
  age?: number;
  role?: string;
  status?: string;
  physicalDescription?: string;
  groups?: string[];
  portfolio?: any[];
}

interface GroupDetailProps {
  group: Group;
  characters: Character[];
  onBack: () => void;
  onEditGroup: () => void;
  onSelectCharacter: (characterId: string) => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ 
  group, 
  characters, 
  onBack, 
  onEditGroup, 
  onSelectCharacter 
}) => {
  // Filtrar personajes que pertenecen a este grupo
  const groupMembers = characters.filter(character => 
    character.groups && character.groups.includes(group.id)
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
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
            <span style={{ color: group.color || "#8B5CF6" }}>{group.name}</span>
          </h2>
          {group.description && (
            <p className="text-gray-400 mt-1">{group.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>ID: {group.id}</span>
            <span>Tipo: {group.type}</span>
            <span>{groupMembers.length} miembros</span>
          </div>
        </div>
      </div>

      {/* Edit Group Button */}
      <div className="mb-8">
        <button
          onClick={onEditGroup}
          className="flex items-center gap-3 px-6 py-3 bg-gray-800 border border-purple-500 rounded-lg hover:bg-gray-700 transition-colors"
          style={{ borderColor: group.color || "#8B5CF6" }}
        >
          <Edit className="h-5 w-5" style={{ color: group.color || "#8B5CF6" }} />
          <div className="text-left">
            <div className="font-semibold text-white">Editar Grupo</div>
            <div className="text-sm text-gray-400">Modificar información del grupo</div>
          </div>
        </button>
      </div>

      {/* Members List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Personajes Asociados ({groupMembers.length})
        </h3>

        {groupMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupMembers.map((character) => (
              <div
                key={character.id}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => onSelectCharacter(character.id)}
              >
                {/* Character Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{character.name}</h4>
                    {character.role && (
                      <p className="text-sm text-blue-400">{character.role}</p>
                    )}
                    {character.age && (
                      <p className="text-xs text-gray-400">{character.age} años</p>
                    )}
                  </div>
                </div>

                {/* Character Description */}
                {character.physicalDescription && (
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                    {character.physicalDescription}
                  </p>
                )}

                {/* Character Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>ID: {character.id}</span>
                  <div className="flex items-center gap-2">
                    {character.status && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        character.status === 'alive' ? 'bg-green-600 text-green-100' :
                        character.status === 'dead' ? 'bg-red-600 text-red-100' :
                        'bg-gray-600 text-gray-100'
                      }`}>
                        {character.status}
                      </span>
                    )}
                    {character.portfolio && character.portfolio.length > 0 && (
                      <span>{character.portfolio.length} img</span>
                    )}
                  </div>
                </div>

                {/* Color indicator */}
                <div className="w-full h-1 bg-blue-500 rounded-full mt-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-white mb-2">
              No hay personajes en este grupo
            </h4>
            <p className="text-gray-400 mb-4">
              Los personajes se asocian a grupos desde su perfil individual.
            </p>
            <p className="text-sm text-gray-500">
              Ve a la sección de Personajes para asignar miembros a "{group.name}".
            </p>
          </div>
        )}
      </div>

      {/* Group Portfolio Preview */}
      {group.portfolio && group.portfolio.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Portfolio del Grupo</h3>
          <div className="text-sm text-gray-400">
            {group.portfolio.length} imagen{group.portfolio.length !== 1 ? 'es' : ''} disponible{group.portfolio.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
