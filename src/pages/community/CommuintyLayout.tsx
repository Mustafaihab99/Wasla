import CreatePostBox from "../../components/community/CreateBoxPost";
import PostList from "../../components/community/PostLists";
import { 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaBookmark, 
  FaUser, 
  FaCog, 
  FaFeather, 
  FaTimes 
} from "react-icons/fa";

const NAV_ITEMS = [
  { icon: FaHome, label: "Home", active: true },
  { icon: FaSearch, label: "Explore" },
  { icon: FaBell, label: "Notifications" },
  { icon: FaBookmark, label: "Bookmarks" },
  { icon: FaUser, label: "Profile" },
  { icon: FaCog, label: "Settings" },
];

function LeftSidebar() {
  return (
    <aside className="sticky top-0 h-screen flex flex-col py-2 pr-4">
      {/* Logo */}
      <div className="p-3 mb-2 w-fit rounded-full hover:bg-white/10 transition cursor-pointer">
        <FaTimes className="w-7 h-7 text-white" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl font-medium transition-all w-fit xl:w-full hover:bg-white/10 ${
              active ? "text-white font-bold" : "text-gray-300"
            }`}
          >
            <Icon className={`w-6 h-6 flex-shrink-0 ${active ? "text-white" : ""}`} />
            <span className="hidden xl:block">{label}</span>
          </button>
        ))}

        {/* Post Button */}
        <button className="mt-4 bg-sky-500 hover:bg-sky-400 transition text-white font-bold rounded-full py-3 px-4 xl:px-8 flex items-center justify-center gap-2 w-fit xl:w-full">
          <FaFeather className="w-5 h-5 xl:hidden" />
          <span className="hidden xl:block">Post</span>
        </button>
      </nav>

      {/* User Profile */}
      <button className="flex items-center gap-3 p-3 rounded-full hover:bg-white/10 transition w-full">
        <img
          src="/assets/images/default-avatar.png"
          className="w-10 h-10 rounded-full object-cover"
          alt="me"
        />
        <div className="hidden xl:block text-left flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">My Account</p>
          <p className="text-gray-500 text-sm truncate">@username</p>
        </div>
        <span className="hidden xl:block text-gray-400 font-bold">···</span>
      </button>
    </aside>
  );
}


export default function CommunityLayout() {
  const currentUserId = sessionStorage.getItem("user_id")!;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1265px] mx-auto grid grid-cols-[auto_1fr_auto] xl:grid-cols-[275px_600px_1fr] gap-0 justify-center">

        {/* Left Sidebar */}
        <div className="px-2 xl:px-0">
          <LeftSidebar />
        </div>

        {/* Main Feed */}
        <main className="border-x border-[#2f3336] min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336]">
            <div className="px-4 py-4">
              <h1 className="text-white font-extrabold text-xl">Home</h1>
            </div>
            {/* Tabs */}
            <div className="grid grid-cols-2">
              <button className="py-4 font-bold text-white border-b-4 border-sky-500 hover:bg-white/5 transition">
                For you
              </button>
              <button className="py-4 font-medium text-gray-500 hover:bg-white/5 transition hover:text-white">
                Following
              </button>
            </div>
          </div>

          <CreatePostBox currentUserId={currentUserId} />
          <div className="h-px bg-[#2f3336]" />
          <PostList currentUserId={currentUserId} />
        </main>

      </div>
    </div>
  );
}
