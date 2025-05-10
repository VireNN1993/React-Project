// src/pages/AdminPanel/AdminPanel.tsx - גרסה מעודכנת מאוד
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Spinner, Button, Checkbox, Alert } from "flowbite-react";
import axios from "axios";
import { BASE_URL } from "../../services/userService"; // ייבוא רק של BASE_URL, לא של ADMIN_API_URL
import { toast } from "react-toastify";
import { FaTrash, FaUserTie, FaUser, FaRedo } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

// טיפוס למשתמש כפי שמוחזר מה-API
interface UserData {
  _id: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  email: string;
  phone: string;
  isBusiness: boolean;
  isAdmin: boolean;
  createdAt: string;
}

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const { userData, isAdmin } = useSelector((state: RootState) => state.user);
  const [retryCount, setRetryCount] = useState(0);

  // פונקציה לבדיקת תקפות הטוקן
  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode<any>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.log("Token expired");
        return false;
      }

      return true;
    } catch (e) {
      console.error("Invalid token:", e);
      return false;
    }
  };

  // פונקציה לטעינת המשתמשים - משתמשת ישירות ב-BASE_URL
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // בדיקה שיש טוקן
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      // בדוק האם הטוקן תקף
      if (!checkToken()) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      console.log("Fetching users from API");
      console.log("API URL:", `${BASE_URL}/users`);

      try {
        // קריאה ישירה ל-API עם BASE_URL
        const { data } = await axios.get(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`Loaded ${data.length} users successfully`);
        setUsers(data);
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw apiError;
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 401) {
          setError(
            "Authentication failed. Your session may have expired. Please log in again.",
          );
          localStorage.removeItem("token");
        } else if (error.response?.status === 403) {
          setError(
            "You don't have permission to access user data. Admin privileges required.",
          );
        } else if (error.response?.status === 404) {
          setError("User data endpoint not found. The API may have changed.");
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else if (error.code === "ECONNABORTED") {
          setError("Request timed out. The server might be busy or down.");
        } else {
          setError(error.response?.data?.message || "Failed to load users");
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }

      toast.error("Could not load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // טעינת המשתמשים בעת טעינת הדף
  useEffect(() => {
    if (!isAdmin) {
      setError("You don't have administrator privileges");
      setLoading(false);
      return;
    }

    fetchUsers();
  }, [isAdmin, retryCount]);

  // פונקציה לניסיון מחדש
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleToggleBusiness = async (userId: string, isBusiness: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      // השתמש ב-BASE_URL ישירות
      await axios.patch(
        `${BASE_URL}/users/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // עדכון מצב המשתמשים באופן מקומי
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBusiness: !isBusiness } : user,
        ),
      );

      toast.success(`User status updated successfully`);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // ודא שהמשתמש לא מוחק את עצמו
    if (userId === userData?._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    // ודא שהמשתמש לא מוחק מנהל אחר
    const userToDelete = users.find((user) => user._id === userId);
    if (userToDelete?.isAdmin) {
      toast.error("You cannot delete another administrator");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      // השתמש ב-BASE_URL ישירות
      await axios.delete(`${BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // הסר את המשתמש מהרשימה המקומית
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  // תצוגת טעינה
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // תצוגת שגיאה עם כפתור ניסיון מחדש מודגש
  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 text-center">
        <Alert color="failure" className="mb-4">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Error Loading Users</h3>
            <p className="mt-2">{error}</p>
          </div>
        </Alert>

        <Button
          onClick={handleRetry}
          color="blue"
          className="mt-4 flex items-center gap-2"
        >
          <FaRedo /> Retry Loading Users
        </Button>

        <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          <p className="font-bold">Troubleshooting Tips:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Check your internet connection</li>
            <li>Make sure the server is online</li>
            <li>Try logging out and logging back in</li>
            <li>Clear your browser cache</li>
            <li>Contact system administrator if the issue persists</li>
          </ul>
        </div>
      </div>
    );
  }

  // תצוגת רשימת המשתמשים
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0 dark:text-white">
          User Management
        </h1>

        <Button
          onClick={handleRetry}
          color="light"
          className="flex items-center gap-2"
        >
          <FaRedo /> Refresh
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-10 text-center dark:bg-gray-800">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No users found in the system.
          </p>
          <Button onClick={handleRetry} color="blue" className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Business
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {`${user.name.first} ${user.name.last}`}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <div className="flex items-center gap-1 font-medium text-purple-600">
                        <FaUserTie /> <span>Admin</span>
                      </div>
                    ) : user.isBusiness ? (
                      <div className="flex items-center gap-1 text-blue-600">
                        <FaUserTie /> <span>Business</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaUser /> <span>Regular</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={user.isBusiness}
                      onChange={() =>
                        handleToggleBusiness(user._id, user.isBusiness)
                      }
                      disabled={user.isAdmin || user._id === userData?._id}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.isAdmin || user._id === userData?._id}
                      className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none disabled:opacity-50"
                    >
                      <div className="mr-2">
                        <FaTrash />
                      </div>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
