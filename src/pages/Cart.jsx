import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { Trash2, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      const { data } = await supabase
        .from("cart")
        .select(`
          id,
          quantity,
          product:product_id (
            id,
            name,
            product_image (
              image_url,
              order
            )
          ),
          variant:variant_id (
            id,
            size,
            price,
            stock,
            grades:grades_id ( name )
          )
        `)
        .eq("user_id", user.id);

      setItems(data || []);
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // DELETE ITEM + TOAST
  const deleteItem = async (id) => {
    const loadingToast = toast.loading("Menghapus item...");

    const { error } = await supabase.from("cart").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus item", { id: loadingToast });
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));

    toast.success("Item dihapus dari keranjang", { id: loadingToast });
  };

  // UPDATE QTY + TOAST
  const updateQuantity = async (cartId, newQty) => {
    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQty })
      .eq("id", cartId);

    if (error) {
      toast.error("Gagal mengubah jumlah");
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === cartId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const totalHarga = items
    .filter((item) => selectedIds.includes(item.id))
    .reduce(
      (sum, item) => sum + Number(item.variant.price) * item.quantity,
      0
    );

  if (loading) return <div className="p-6 text-center">Memuat keranjang...</div>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            if (onClose) onClose();
            else navigate(-1);
          }}
          className="p-2 rounded-full bg-white shadow-sm hover:scale-110 transition"
        >
          {onClose ? (
            <X size={20} className="text-black" />
          ) : (
            <ArrowLeft size={20} className="text-black" />
          )}
        </button>

        <h1 className="text-3xl font-bold tracking-wide">
          Keranjang Belanja
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-gray-600 p-10 border rounded-lg bg-white shadow-sm">
          Keranjangmu masih kosong.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => {
              const img =
                item.product.product_image?.length > 0
                  ? item.product.product_image[0].image_url
                  : null;

              const maxStock = item.variant.stock;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-5 border rounded-xl bg-white shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4"
                  />

                  <div
                    className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden"
                    onClick={() => {
                      window.dispatchEvent(new Event("close-sidebar"));
                      navigate(`/product/${item.product.id}`);
                    }}
                  >
                    {img && (
                      <img
                        src={img}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-[15px]">
                      {item.product.name}
                    </h2>

                    <p className="text-sm mt-1">
                      Rp{" "}
                      {Number(item.variant.price).toLocaleString("id-ID")}
                    </p>

                    <p className="text-sm mt-1">
                      Size: {item.variant.size}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 border rounded"
                      >
                        -
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          item.quantity < maxStock &&
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-10 border-t pt-6 flex items-center justify-between">
            <div className="text-lg font-semibold">
              Total: Rp {totalHarga.toLocaleString("id-ID")}
            </div>

            <button
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold ${
                selectedIds.length === 0
                  ? "bg-gray-300 text-gray-500"
                  : "bg-black text-white"
              }`}
              onClick={() => {
                if (selectedIds.length === 0) {
                  toast.error("Pilih minimal 1 produk");
                  return;
                }

                const selectedItems = items.filter((item) =>
                  selectedIds.includes(item.id)
                );

                toast.success("Menuju checkout");
                navigate("/checkout", {
                  state: { selectedItems },
                });
              }}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}