import { useState } from "react";
import { FaInbox, FaRocket, FaCog, FaUsers, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <>
      {/* Hamburger menu button (only visible on mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 p-6 border-r bg-[#f8f9fa] z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex
        `}
      >
        <div className="flex flex-col justify-between h-full w-full"  style={{ fontFamily: 'Montserrat' }}>
          <div>
            {/* Logo */}
            <div className="mb-10 flex justify-center">
              <img
                src="/Group-3907.png"
                alt="MySite Logo"
                className="h-11 cursor-pointer"
              />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 w-full">
              <SidebarItem icon={<FaInbox />} label="Projects" to="/projects" onClick={closeSidebar} />
              <SidebarItem icon={<FaUsers />} label="Clients" to="/clients" onClick={closeSidebar} />
              <SidebarItem icon={<FaRocket />} label="Blog Uploads" to="/blogs" onClick={closeSidebar} />
              <SidebarItem icon={<FaCog />} label="Enquiries" to="/enquiries" onClick={closeSidebar} />
            </nav>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition w-full"
          >
           
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
           
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ icon, label, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 w-full text-left transition
        ${isActive ? "border-l-4 border-gray-400 bg-gray-100 font-semibold" : ""}
        hover:bg-gray-100 hover:border-l-4 hover:border-gray-300`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;
