import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/authContext";

export default function HeaderIcons({ setSidebar, isOnHero }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [initial, setInitial] = useState("U");

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("usernames")
        .eq("id", user.id)
        .single();

      if (data?.usernames) {
        setInitial(data.usernames.charAt(0).toUpperCase());
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="flex items-center gap-4">

      {/* CART */}
      <button className="relative" onClick={() => setSidebar("cart")}>
        <ShoppingCart strokeWidth={1.5} size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
            {cartCount}
          </span>
        )}
      </button>

      {/* WISHLIST */}
      <button className="relative" onClick={() => setSidebar("wishlist")}>
        <Heart strokeWidth={1.5} size={24} />
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
            {wishlistCount}
          </span>
        )}
      </button>

      {/* USER */}
      {user ? (
        <button
          onClick={() => navigate("/dashboard")}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center font-semibold
            ${isOnHero ? "bg-white text-black" : "bg-black text-white"}
          `}
        >
          {initial}
        </button>
      ) : (
         <button onClick={() => navigate("/login")}>
          <span className={`${isOnHero ? "text-white" : "text-black"} font-medium`}>
            Login
          </span>
        </button>
      )}
    </div>
  );
}
