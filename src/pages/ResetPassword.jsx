import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";

export default function ResetPassword() {
  const [newPass, setNewPass] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // 1. Update password Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: newPass,
    });

    if (error) {
      setErr(error.message);
      return;
    }

    // 2. SINKRONKAN ke profiles.pass
    await supabase
      .from("profiles")
      .update({ pass: newPass })
      .eq("id", user.id);

    // 3. Bersihkan recovery + logout
    localStorage.removeItem("reset-mode");
    await supabase.auth.signOut();

    // 4. Kembali ke login
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Buat Password Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="text-sm font-medium">Password Baru</label>
            <input
              type={showPass ? "text" : "password"}
              className="w-full mt-1 px-4 py-3 rounded-xl outline-none bg-white border border-[#E5E1D8]"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-11 text-gray-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className="w-full py-3 bg-black text-white rounded-xl">
            Simpan Password
          </button>

          {err && <p className="text-red-600 text-center">{err}</p>}
        </form>
      </div>
    </div>
  );
}