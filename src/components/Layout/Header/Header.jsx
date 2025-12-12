// src/components/Layout/Header/Header.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/authContext";
import SearchPopup from "../../Search/SearchPopup";
import supabase from "../../../lib/supabaseClient";

import HeaderNav from "./HeaderNav";
import HeaderSearch from "./HeaderSearch";
import HeaderIcons from "./HeaderIcons";
import { useSearch } from "../../../context/SearchContext";
import { RightSidebar } from "../../SideBar/RightSidebar";

import Cart from "../../../pages/Cart";
import Wishlist from "../../../pages/Wishlist";

export default function Header({ isOnHero }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  const [sidebar, setSidebar] = useState(null);
  const [query, setQuery] = useState("");

  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // KETIKAN USER
  const handleTyping = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSearchQuery("");
      setShowPopup(false);
      setSearchResults([]);
      return;
    }

    setSearchQuery(value);
  };

  // ENTER → HALAMAN SEARCH
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setShowPopup(false);
      navigate(`/search?q=${query}`);
    }
  };

  // ================================================================
  // FINAL LIVE SEARCH — PAKAI LOGIKA ORDER SEPERTI DI PAGE LAIN
  // ================================================================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowPopup(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        // 1. Produk
        const { data: products } = await supabase
          .from("product")
          .select("id, name")
          .ilike("name", `%${searchQuery}%`);

        if (!products?.length) {
          setSearchResults([]);
          setShowPopup(true);
          return;
        }

        const ids = products.map((p) => p.id);

        // 2. Relasi product_image (PAKAI NESTED SELECT SEPERTI PAGE LAIN)
        const { data: imgs } = await supabase
          .from("product_image")
          .select("product_id, image_url, order")
          .in("product_id", ids);

        // 3. Harga
        const { data: prices } = await supabase
          .from("stock_variants")
          .select("product_id, price")
          .in("product_id", ids);

        // 4. Gabung data
        const merged = products.map((p) => {
          const pid = Number(p.id);

          const img = imgs?.find(
            (i) => Number(i.product_id) === pid && i.order === 1
          );

          const price = prices?.find(
            (pr) => Number(pr.product_id) === pid
          );

          return {
            ...p,
            image_url: img?.image_url || null,
            price: price?.price || null,
          };
        });

        // 5. Sort relevansi + limit
        const sorted = merged
          .sort((a, b) => {
            const A = a.name
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase());
            const B = b.name
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase());
            return A - B;
          })
          .slice(0, 5);

        setSearchResults(sorted);
        setShowPopup(true);
      } catch (err) {
        console.log("Live search error:", err);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  // SCROLL HIDE HEADER
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-300
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          bg-transparent
          ${isOnHero ? "text-white" : "text-black"}
        `}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div
            className="font-bold text-xl cursor-pointer relative -top-1"
            onClick={() => {
              navigate("/");
              setQuery("");
              setSearchQuery("");
              setShowPopup(false);
            }}
          >
            Kavva
          </div>

          <HeaderNav isOnHero={isOnHero} />

          <div className="flex items-center gap-4 relative">
            {/* INPUT SEARCH */}
            <HeaderSearch
              query={query}
              setQuery={handleTyping}
              handleSearch={handleSearch}
              isOnHero={isOnHero}
            />

            {/* POPUP */}
            {showPopup && searchResults.length > 0 && (
              <SearchPopup
                results={searchResults}
                onSelect={(item) => {
                  setShowPopup(false);
                  navigate(`/product/${item.id}`);
                }}
                onClose={() => setShowPopup(false)}
              />
            )}

            <HeaderIcons
              user={user}
              setSidebar={setSidebar}
              isOnHero={isOnHero}
            />
          </div>
        </div>
      </header>

      <RightSidebar open={sidebar !== null} onClose={() => setSidebar(null)}>
        {sidebar === "cart" && <Cart />}
        {sidebar === "wishlist" && <Wishlist />}
      </RightSidebar>
    </>
  );
}