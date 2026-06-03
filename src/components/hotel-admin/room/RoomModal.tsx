import type { ReactNode } from "react";

interface RoomModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "md" | "lg";
}

export function RoomModal({ title, children, onClose, size = "md" }: RoomModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${size === "lg" ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
