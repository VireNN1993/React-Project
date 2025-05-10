// src/pages/AdminPanel/AdminPanel.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Spinner, Button, Checkbox } from "flowbite-react";
import axios from "axios";
import { BASE_URL } from "../../services/userService";
import { toast } from "react-toastify";
import { FaTrash, FaUserTie, FaUser } from "react-icons/fa";

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
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication required");
          return;
        }

        const { data } = await axios.get<UserData[]>(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to load users");
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

    fetchUsers();
  }, []);

  const handleToggleBusiness = async (userId: string, isBusiness: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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
      if (!token) return;

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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 text-center">
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800 dark:text-white">
        User Management
      </h1>

      {users.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No users found in the system.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
