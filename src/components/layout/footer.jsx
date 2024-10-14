import Link from "next/link";
import ToastComponent from "./toast";

export default function FooterComponent({ isBeforeLogin }) {
  return (
    <>
      {isBeforeLogin ? (
        ""
      ) : (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t z-50 py-2 flex justify-between gap-4 items-center">
          <Link
            href="/main/feed"
            className="flex px-4  flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs">홈</span>
          </Link>
          <Link
            href="#"
            style={{ borderRadius: "9999px" }}
            className="flex px-4 ml-8 flex-col rounded-lg p-4 bg-[#D1F1E0] items-center gap-1 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <UserIcon className="w-6 h-6" />
          </Link>
          <Link
            href="/member/profile/edit"
            className="flex px-4 flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-xs">마이페이지</span>
          </Link>
        </div>
      )}
      <ToastComponent />
    </>
  );
}
function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
