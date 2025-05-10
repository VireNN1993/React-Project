// src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import CreateCard from "../pages/CreateCard/CreateCard";
import EditCard from "../pages/EditCard/EditCard";
import CardDetails from "../pages/CardDetails/CardDetails";
import FavoriteCards from "../pages/FavoriteCards/FavoriteCards";
import MyCards from "../pages/MyCards/MyCards";
import AdminPanel from "../pages/AdminPanel/AdminPanel";
import Page404 from "../pages/Page404/Page404";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import BusinessRoute from "./BusinessRoute";
import AdminRoute from "./AdminRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* נתיבים ציבוריים */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/card/:id" element={<CardDetails />} />

      {/* נתיבים פרטיים - רק למשתמשים מחוברים */}
      <Route element={<PrivateRoute />}>
        <Route path="/favorites" element={<FavoriteCards />} />
      </Route>

      {/* נתיבים עסקיים - רק למשתמשים עסקיים */}
      <Route element={<BusinessRoute />}>
        <Route path="/create-card" element={<CreateCard />} />
        <Route path="/edit-card/:id" element={<EditCard />} />
        <Route path="/my-cards" element={<MyCards />} />
      </Route>

      {/* נתיבים למנהלים - רק למשתמשים מנהלים */}
      <Route element={<AdminRoute />}>
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Route>

      {/* דף 404 - לכל הנתיבים האחרים */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AppRouter;
