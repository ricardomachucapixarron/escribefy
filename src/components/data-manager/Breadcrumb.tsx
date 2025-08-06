"use client"

interface BreadcrumbItem {
  label: string
  onClick?: () => void
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <div className="flex items-center text-sm mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="text-gray-500 mx-2">/</span>}
          {item.onClick && !item.isActive ? (
            <button
              onClick={item.onClick}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={item.isActive ? "text-gray-300" : "text-gray-400"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
