import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Map, User, Trophy, Calendar, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { name: "Map", path: "Map", icon: Map },
    { name: "Profile", path: "Profile", icon: User },
    { name: "Leaderboard", path: "Leaderboard", icon: Trophy },
    { name: "Meetup", path: "Meetup", icon: Calendar },
  ];

  if (isAdmin) {
    navItems.push({ name: "Admin", path: "Admin", icon: Shield });
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 shadow-lg md:hidden flex-shrink-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Map className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Poster Quest</h1>
              <p className="text-xs text-blue-100">Nashville Campaign</p>
            </div>
          </div>
          {currentUser && !loading && (
            <div className="text-right">
              <div className="text-sm font-semibold">{currentUser.total_points || 0} pts</div>
              <div className="text-xs text-blue-100">{currentUser.poster_count || 0} posters</div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - adjusted for mobile bottom nav */}
      <main className="flex-1 overflow-auto min-h-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile - Always visible */}
      <nav className="bg-white border-t border-gray-200 shadow-lg md:hidden flex-shrink-0 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === createPageUrl(item.path);
            return (
              <Link
                key={item.path}
                to={createPageUrl(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 shadow-lg z-50">
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Map className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-xl">Poster Quest</h1>
              <p className="text-sm text-blue-100">Nashville Campaign</p>
            </div>
          </div>
          {currentUser && !loading && (
            <div className="mt-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-white">
                <div className="font-semibold">{currentUser.full_name}</div>
                <div className="text-sm text-blue-100 mt-1">
                  {currentUser.total_points || 0} points • {currentUser.poster_count || 0} posters
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === createPageUrl(item.path);
            return (
              <Link
                key={item.path}
                to={createPageUrl(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Content Offset */}
      <style>{`
        @media (min-width: 768px) {
          main {
            margin-left: 16rem;
          }
        }
      `}</style>
    </div>
  );
}
