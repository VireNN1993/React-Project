// src/components/Navbar.tsx
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  DarkThemeToggle,
  TextInput,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { clearUser } from "../redux/slices/userSlice";
import { setSearchTerm } from "../redux/slices/cardsSlice";
import { FaSearch } from "react-icons/fa";

const AppNavbar = () => {
  const { isLoggedIn, isBusiness, isAdmin, userData } = useSelector(
    (state: RootState) => state.user,
  );
  const { searchTerm } = useSelector((state: RootState) => state.cards);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));

    // אם המשתמש לא נמצא בדף הבית, ננווט לשם
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <Navbar fluid rounded className="shadow-md">
      <NavbarBrand>
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-6 sm:h-9" alt="BCard Logo" />
          <span className="text-xl font-semibold whitespace-nowrap dark:text-white">
            BussinesCards
          </span>
        </Link>
      </NavbarBrand>

      {/* שורת החיפוש */}
      <div className="mx-4 hidden max-w-md flex-grow md:block">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500">
              <FaSearch />
            </span>
          </div>
          <TextInput
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:order-2">
        <DarkThemeToggle />
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-gray-700 md:inline dark:text-gray-300">
              Hello, {userData?.name?.first || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/signin"
              className="text-sm text-blue-600 hover:underline"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
        >
          About
        </Link>
        {isLoggedIn && (
          <Link
            to="/favorites"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
          >
            Favorites
          </Link>
        )}
        {isBusiness && (
          <>
            <Link
              to="/create-card"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
            >
              Create Card
            </Link>
            <Link
              to="/my-cards"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
            >
              My Cards
            </Link>
          </>
        )}
        {isAdmin && (
          <Link
            to="/admin-panel"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
          >
            Admin
          </Link>
        )}

        {/* שורת חיפוש למסכים קטנים */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500">
                <FaSearch />
              </span>
            </div>
            <TextInput
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10"
            />
          </div>
        </div>
      </NavbarCollapse>
    </Navbar>
  );
};

export default AppNavbar;
