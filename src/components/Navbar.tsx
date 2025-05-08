import { Navbar, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { clearUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const { isLoggedIn, isBusiness, isAdmin } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <Navbar fluid rounded className="shadow-md">
      <Link to="/" className="text-xl font-bold text-blue-600">
        BizCards
      </Link>

      <div className="flex gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>

        {isLoggedIn && (
          <Link to="/favorites" className="text-gray-700 hover:text-blue-600">
            Favorites
          </Link>
        )}

        {isBusiness && (
          <Link to="/create-card" className="text-gray-700 hover:text-blue-600">
            Create Card
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin-panel" className="text-gray-700 hover:text-blue-600">
            Admin
          </Link>
        )}
      </div>

      <div className="flex gap-2">
        {!isLoggedIn ? (
          <>
            <Link to="/signin">
              <Button size="sm" color="blue">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" color="light">
                Sign Up
              </Button>
            </Link>
          </>
        ) : (
          <Button size="sm" color="gray" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </Navbar>
  );
};

export default AppNavbar;
