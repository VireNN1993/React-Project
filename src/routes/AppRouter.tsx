import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import CreateCard from "../pages/CreateCard/CreateCard.tsx";
import EditCard from "../pages/EditCard/EditCard";
import CardDetails from "../pages/CardDetails/CardDetails";
import FavoriteCards from "../pages/FavoriteCards/FavoriteCards";
import Page404 from "../pages/Page404/Page404";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/create-card" element={<CreateCard />} />
      <Route path="/edit-card/:id" element={<EditCard />} />
      <Route path="/card/:id" element={<CardDetails />} />
      <Route path="/favorites" element={<FavoriteCards />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AppRouter;
