import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { getProductsByBrandSlug, getProductsByCategorySlug } from "../../services/ProductService";
import ProductCard from "../../components/Product/ProductCard";
import SidebarFilter from "../../components/SidebarFilter";

export default function CategoryPage() {
  const { main, sub } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, [main, sub, params.toString()]); // penting: URL filter berubah → refetch

  async function load() {
    const brandSlugs = ["nike", "adidas", "puma", "reebok", "asics", "newbalance", "converse"];

    // ambil filters dari URL (SidebarFilter sudah mengisi ini) :contentReference[oaicite:5]{index=5}
    const filters = {
      grades: params.get("grades") ? params.get("grades").split(",") : [],
      price: params.get("price") || null,
    };

    if (brandSlugs.includes(main)) {
      const data = await getProductsByBrandSlug(main, filters); // slug lock dulu (brand), baru filter
      return setProducts(data);
    }

    const slug = sub ? sub : main;
    const data = await getProductsByCategorySlug(slug, filters); // slug lock dulu (category), baru filter
    setProducts(data);
  }

  return (
    <div className="p-6 pt-28">
      <div className="flex items-center gap-3 mb-4">
        <button
          className="p-2 bg-white rounded-full shadow-sm hover:scale-110 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="text-black" />
        </button>

        <h1 className="text-xl font-bold capitalize">
          {main} {sub && "> " + sub}
        </h1>
      </div>

      <div className="flex">
        <SidebarFilter />

        <div className="flex-1">
          {products.length === 0 && (
            <p className="text-center">Belum ada produk yang di tambahkan.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
