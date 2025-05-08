// src/pages/Home/Home.tsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setAllCards } from "../../redux/slices/cardsSlice";
import { Spinner, Button } from "flowbite-react";
import axios from "axios";
import { BASE_URL } from "../../services/userService";
import { toast } from "react-toastify";
import CardItem from "../../components/CardItem";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const CARDS_PER_PAGE = 8;

const Home = () => {
  const dispatch = useDispatch();
  const { allCards, filteredCards, searchTerm } = useSelector(
    (state: RootState) => state.cards,
  );
  const { isLoggedIn, isBusiness } = useSelector(
    (state: RootState) => state.user,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // טעינת כרטיסים מהשרת
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/cards`);
        dispatch(setAllCards(data));
      } catch (error: unknown) {
        console.error("Failed to fetch cards:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to load cards");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
        toast.error("Could not load cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (allCards.length === 0) {
      fetchCards();
    } else {
      setLoading(false);
    }
  }, [dispatch, allCards.length]);

  // עדכון מספר העמוד הנוכחי כשמשנים את החיפוש
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // חישוב דפדוף
  const totalCards = filteredCards.length;
  const totalPages = Math.ceil(totalCards / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const displayedCards = filteredCards.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE,
  );

  // טיפול במעבר בין העמודים
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // רשימת מספרי עמודים לתצוגה
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // הצג את כל המספרים אם יש מעט עמודים
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // חישוב מורכב יותר עבור דפים רבים
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      // הוסף דף ראשון
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      // הוסף דפים באמצע
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // הוסף דף אחרון
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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
          <p className="font-medium">Error loading cards</p>
          <p>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
          Wellcome to BussinesCards
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Discover business cards from professionals around the world. Create
          your own business card and share your contact information easily.
        </p>

        {/* Create Card Button for Business Users */}
        {isLoggedIn && isBusiness && (
          <div className="mb-8">
            <Link
              to="/create-card"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            >
              <FaPlusCircle />
              <span className="ml-2">Create New Card</span>
            </Link>
          </div>
        )}
      </section>

      {/* Cards Grid */}
      <section className="mb-10">
        {displayedCards.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {searchTerm.trim() !== ""
                ? `No cards found matching "${searchTerm}"`
                : "No cards available yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1}-
              {Math.min(startIndex + CARDS_PER_PAGE, totalCards)} of{" "}
              {totalCards} results
              {searchTerm.trim() !== "" && <span> for "{searchTerm}"</span>}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {displayedCards.map((card) => (
                <CardItem key={card._id} card={card} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {/* Previous Button */}
          <Button
            color="light"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <Button
                key={index}
                color={currentPage === page ? "blue" : "light"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2 py-1">
                {page}
              </span>
            ),
          )}

          {/* Next Button */}
          <Button
            color="light"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
