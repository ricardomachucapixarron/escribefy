import React from "react";
import { Plus, Edit } from "lucide-react";

export interface GroupingType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface GroupTypesListProps {
  groupingTypes: GroupingType[];
  onSelect: (typeId: string) => void;
  onEdit: (typeId: string) => void;
  onAdd: () => void;
}

const GroupTypesList: React.FC<GroupTypesListProps> = ({ groupingTypes, onSelect, onEdit, onAdd }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tipos de Grupo</h2>
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
          onClick={onAdd}
        >
          <Plus size={18} /> Añadir tipo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupingTypes.map((type) => (
          <div
            key={type.id}
            className="rounded-lg bg-gray-800 border border-purple-500 p-4 flex flex-col gap-2 shadow hover:shadow-lg transition cursor-pointer"
            style={{ borderColor: type.color || "#8B5CF6" }}
            onClick={() => onSelect(type.id)}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg" style={{ color: type.color || "#8B5CF6" }}>{type.name}</span>
              <button
                className="p-1 text-purple-400 hover:text-purple-200"
                onClick={e => { e.stopPropagation(); onEdit(type.id); }}
                title="Editar tipo de grupo"
              >
                <Edit size={18} />
              </button>
            </div>
            {type.description && (
              <p className="text-gray-300 text-sm">{type.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupTypesList;
