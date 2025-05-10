// src/pages/FavoriteCards/FavoriteCards.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Spinner } from "flowbite-react";
import { CardType } from "../../types/Card";
import CardItem from "../../components/CardItem";
import axios from "axios";
import { BASE_URL } from "../../services/userService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const FavoriteCards = () => {
  const [loading, setLoading] = useState(true);
  const [favoriteCards, setFavoriteCards] = useState<CardType[]>([]);
  const { userData, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );
  const { allCards } = useSelector((state: RootState) => state.cards);

  useEffect(() => {
    const fetchFavoriteCards = async () => {
      if (!isLoggedIn || !userData?._id) return;

      try {
        setLoading(true);

        // אם יש כבר כרטיסים במצב הגלובלי
        if (allCards.length > 0) {
          // סנן את הכרטיסים המועדפים
          const favorites = allCards.filter((card) =>
            card.likes.includes(userData._id),
          );
          setFavoriteCards(favorites);
          setLoading(false);
          return;
        }

        // אם אין כרטיסים במצב הגלובלי, טען את כל הכרטיסים
        const { data } = await axios.get<CardType[]>(`${BASE_URL}/cards`);
        const favorites = data.filter((card) =>
          card.likes.includes(userData._id),
        );
        setFavoriteCards(favorites);
      } catch (error) {
        console.error("Failed to fetch favorite cards:", error);
        toast.error("Failed to load your favorite cards");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCards();
  }, [isLoggedIn, userData, allCards]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800 dark:text-white">
        My Favorite Cards
      </h1>

      {favoriteCards.length === 0 ? (
        <div className="mt-10 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-medium text-gray-700 dark:text-gray-300">
            You don't have any favorite cards yet
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Browse through business cards and add them to your favorites by
            clicking the heart icon.
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            <span className="mr-2">
              <FaHeart />
            </span>
            Find Cards to Like
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favoriteCards.map((card) => (
            <CardItem key={card._id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteCards;
