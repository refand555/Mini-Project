// src/components/Search/SearchPopup.jsx
import { useEffect, useRef } from "react";

export default function SearchPopup({ results, onSelect, onClose }) {
  const popupRef = useRef(null);

  // Auto close jika klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute left-1/2 top-14 -translate-x-1/2 w-[90vw] max-w-3xl z-50">
      <div
        ref={popupRef}
        className="bg-white shadow-xl rounded-xl p-4 overflow-x-auto flex gap-4 scrollbar-hide"
      >
        {results.map((item) => (
          <div
            key={item.id}
            className="min-w-[160px] cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-2 font-semibold text-sm leading-tight">
              {item.name}
            </p>

            <p className="text-xs text-gray-600">
              {item.price ? `IDR ${item.price.toLocaleString()}` : "IDR -"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}