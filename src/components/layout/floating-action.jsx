import { useState } from "react";
import {
  UserIcon,
  HouseIcon,
  PlusIcon,
  MenuIcon,
  LogOutIcon,
} from "lucide-react";
import { useRouter } from "next/router";

export default function FloatingActionButton() {
  const router = useRouter();

  return (
    <div className="fixed bottom-20 right-4">
      <div className="relative">
        {/* 하위 메뉴 */}

        {/* 햄버거 메뉴 버튼 */}
        <button
          onClick={() => router.push(`/main/feed/meal`)}
          style={{ borderRadius: "9999px" }}
          className="bg-[#D1F1E0] text-black p-4 shadow-lg transition-colors duration-300"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
