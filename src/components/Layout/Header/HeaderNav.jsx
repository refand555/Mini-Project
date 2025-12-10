import { ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "./categoriesData";
import { useSearch } from "../../../context/SearchContext";

export default function HeaderNav({ isOnHero }) {
  const navigate = useNavigate();
  const { setSearchQuery } = useSearch();

  return (
    <nav className="flex-1 flex justify-center">
      <ul className={`flex items-center gap-10 text-sm font-bold transition-all`}>
        {categories.map((cat, i) => (
          <li key={i} className="relative group cursor-pointer flex items-center gap-1">

            <div
              className={`
                flex items-center gap-2 pb-1 transition
                ${isOnHero ? "text-white" : "text-black"}
              `}
            >
              {cat.name}

              {cat.submenu.length > 0 && (
                <span className="flex items-center">
                  <ChevronRight
                    size={16}
                    className={`group-hover:hidden block ${isOnHero ? "text-white" : "text-black"}`}/>
                  <ChevronDown
                    size={16}
                    className={`hidden group-hover:block ${isOnHero ? "text-white" : "text-black"}`}/>
                </span>
              )}

              <span
                className={`
                  absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[2px] 
                  transition-all duration-300 group-hover:w-full
                  ${isOnHero ? "bg-white" : "bg-black"}
                `}
              />
            </div>

            {/* submenu */}
            {cat.submenu.length > 0 && (
              <div className={`
                absolute top-full mt-2 left-0 w-48 rounded-xl shadow-lg 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300 z-50
                ${isOnHero ? "bg-white text-black" : "bg-white text-black"}
              `}>
                <ul className="py-2">
                  {cat.submenu.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSearchQuery("");
                        navigate(item.path);
                        window.scrollTo(0, 0);
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </li>
        ))}
      </ul>
    </nav>
  );
}
