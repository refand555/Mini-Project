import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PRODUK
  useEffect(() => {
    async function fetchSearch() {
      setLoading(true);

      const { data, error } = await supabase
        .from("product")
        .select(`
          id,
          name,
          product_image (order, image_url),
          stock_variants (price)
        `)
        .ilike("name", `%${q}%`);

      setProducts(data || []);
      setLoading(false);
    }

    fetchSearch();
  }, [q]);

  return (
    <div className="pt-28 px-6 md:px-12 lg:px-20 pb-20">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Search results for <span className="text-gray-500">"{q}"</span>
        </h1>

        <button
        className="absolute left-4 top-20 z-[999] p-2 bg-white/90 rounded-full shadow-sm hover:scale-110 transition"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} className="text-black" />
      </button> 
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20 text-gray-500 text-lg">
          Searching products...
        </div>
      )}

      {/* TIDAK ADA HASIL */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20 text-gray-500 text-lg">
          No products found for "{q}"
        </div>
      )}

      {/* GRID PRODUK */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => {
          const sortedImages = (p.product_image || []).sort(
            (a, b) => a.order - b.order
          );

          const img1 = sortedImages?.[0]?.image_url;
          const img2 = sortedImages?.[1]?.image_url || img1;

          const price = p.stock_variants?.[0]?.price;

          return (
            <div
              key={p.id}
              className="group cursor-pointer relative"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              {/* IMAGE WRAPPER */}
              <div className="w-full h-48 md:h-60 rounded-xl overflow-hidden bg-gray-100 relative">
                <img
                  src={img1}
                  className="w-full h-full object-cover transition-opacity duration-300 absolute inset-0 opacity-100 group-hover:opacity-0"
                  alt={p.name}
                />
                <img
                  src={img2}
                  className="w-full h-full object-cover transition-opacity duration-300 absolute inset-0 opacity-0 group-hover:opacity-100"
                  alt={p.name}
                />
              </div>

              {/* NAMA */}
              <p className="font-semibold mt-3 text-[15px] leading-tight">
                {p.name}
              </p>

              {/* HARGA */}
              <p className="mt-1 text-gray-600 text-sm">
                {price ? `IDR ${price.toLocaleString()}` : "IDR -"}
              </p>

              {/* BUTTON WISHLIST */}
              <button
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("wishlist:", p.id);
                }}
              >
                <Heart size={18} />
              </button>

              {/* BUTTON ADD TO CART */}
              <button
                className="absolute bottom-3 right-3 bg-black text-white rounded-full p-2 shadow hover:scale-110 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("add to cart:", p.id);
                }}
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
