import { useEffect } from "react";

export function RightSidebar({ open, onClose, children }) {
  useEffect(() => {
    const handleClose = () => {
      onClose();
    };

    window.addEventListener("close-sidebar", handleClose);

    return () => {
      window.removeEventListener("close-sidebar", handleClose);
    };
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[9998] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel kanan */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-white shadow-xl overflow-y-auto z-[99999] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}