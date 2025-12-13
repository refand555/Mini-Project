// src/components/Filter/SidebarFilter.jsx
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";

const GRADE_OPTIONS = ["BNIB", "VNDS", "USED"];

const PRICE_OPTIONS = [
  { label: "< 1.000.000", value: "lt-1000000" },
  { label: "1.000.000 - 3.000.000", value: "1000000-3000000" },
  { label: "> 3.000.000", value: "gt-3000000" },
];

export default function SidebarFilter() {
  const [params, setParams] = useSearchParams();

  const location = useLocation();
  const navigate = useNavigate();

  const handleResetFilter = () => {
    navigate(location.pathname); // buang semua ?query
  };

  const gradesParam = params.get("grades");
  const priceParam = params.get("price");

  const selectedGrades = gradesParam ? gradesParam.split(",") : [];
  const selectedPrice = priceParam || null;

  function toggleGrade(grade) {
    let newGrades;

    if (selectedGrades.includes(grade)) {
      newGrades = selectedGrades.filter((g) => g !== grade);
    } else {
      newGrades = [...selectedGrades, grade];
    }

    if (newGrades.length > 0) {
      params.set("grades", newGrades.join(","));
    } else {
      params.delete("grades");
    }

    setParams(params, { replace: true });
  }

  function setPrice(value) {
    if (value === selectedPrice) {
      params.delete("price");
    } else {
      params.set("price", value);
    }

    setParams(params, { replace: true });
  }

  return (
    <aside className="w-64 shrink-0 pr-6">
      {/* GRADES */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Grades</h3>
        <div className="space-y-2">
          {GRADE_OPTIONS.map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGrades.includes(g)}
                onChange={() => toggleGrade(g)}
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div>
        <h3 className="font-semibold mb-3">Price</h3>
        <div className="space-y-2">
          {PRICE_OPTIONS.map((p) => (
            <label key={p.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selectedPrice === p.value}
                onChange={() => setPrice(p.value)}
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleResetFilter}
          className="mt-6 w-full border border-black text-black py-2 rounded-full text-sm hover:bg-black hover:text-white transition"
        >
          Reset Filter
        </button>

      </div>
    </aside>
  );
}
