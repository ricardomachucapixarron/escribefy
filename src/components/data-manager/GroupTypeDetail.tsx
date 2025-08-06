import React from "react";
import { Edit, Users, ArrowLeft, Plus } from "lucide-react";

export interface GroupingType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  type: string;
  color?: string;
  memberCount?: number;
}

interface GroupTypeDetailProps {
  groupType: GroupingType;
  groups: Group[];
  onBack: () => void;
  onEditType: () => void;
  onSelectGroup: (groupId: string) => void;
  onEditGroup: (groupId: string) => void;
  onAddGroup: () => void;
}

const GroupTypeDetail: React.FC<GroupTypeDetailProps> = ({ 
  groupType, 
  groups, 
  onBack, 
  onEditType, 
  onSelectGroup,
  onEditGroup,
  onAddGroup
}) => {
  const groupsOfThisType = groups.filter(group => group.type === groupType.id);

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
            <span style={{ color: groupType.color || "#8B5CF6" }}>{groupType.name}</span>
          </h2>
          {groupType.description && (
            <p className="text-gray-400 mt-1">{groupType.description}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onEditType}
          className="flex items-center gap-3 px-6 py-3 bg-gray-800 border border-purple-500 rounded-lg hover:bg-gray-700 transition-colors"
          style={{ borderColor: groupType.color || "#8B5CF6" }}
        >
          <Edit className="h-5 w-5" style={{ color: groupType.color || "#8B5CF6" }} />
          <div className="text-left">
            <div className="font-semibold text-white">Editar Tipo</div>
            <div className="text-sm text-gray-400">Modificar información del tipo</div>
          </div>
        </button>

        <button
          onClick={() => onAddGroup()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
          style={{ backgroundColor: groupType.color || "#8B5CF6" }}
        >
          <Plus size={18} /> Añadir grupo
        </button>
      </div>

      {/* Lista completa de grupos */}
      {groupsOfThisType.length > 0 ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Grupos de {groupType.name} ({groupsOfThisType.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupsOfThisType.map((group) => (
              <div
                key={group.id}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-purple-500 transition-colors cursor-pointer"
                style={{ borderColor: group.color || groupType.color || "#8B5CF6" }}
                onClick={() => onSelectGroup(group.id)}
              >
                {/* Group Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-white mb-1">{group.name}</h4>
                    {group.memberCount !== undefined && (
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users size={14} />
                        {group.memberCount} miembros
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onEditGroup(group.id); 
                    }}
                    className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                    title="Editar grupo"
                  >
                    <Edit size={16} />
                  </button>
                </div>

                {/* Group Description */}
                {group.description && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}

                {/* Group Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>ID: {group.id}</span>
                  {group.portfolio && group.portfolio.length > 0 && (
                    <span>{group.portfolio.length} imágenes</span>
                  )}
                </div>

                {/* Color indicator */}
                <div 
                  className="w-full h-1 rounded-full mt-3"
                  style={{ backgroundColor: group.color || groupType.color || "#8B5CF6" }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No hay grupos de este tipo</h3>
          <p className="text-gray-400 mb-4">Aún no se han creado grupos para "{groupType.name}"</p>
          <button
            onClick={() => onAddGroup()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            Crear primer grupo
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupTypeDetail;
