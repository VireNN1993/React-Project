// src/pages/Home/Home.tsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setAllCards } from "../../redux/slices/cardsSlice";
import { CardType } from "../../types/Card";
import { Spinner, TextInput, Button } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../services/userService";
import { toast } from "react-toastify";
import CardItem from "../../components/CardItem.tsx"; // נניח שיש לך כבר קומפוננטה כזו

const CARDS_PER_PAGE = 8;

const Home = () => {
  const dispatch = useDispatch();
  const allCards = useSelector((state: RootState) => state.cards.allCards);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);

  // טעינת כרטיסים מהשרת
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<CardType[]>(`${BASE_URL}/cards`);
        dispatch(setAllCards(data));
        setFilteredCards(data);
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
      setFilteredCards(allCards);
      setLoading(false);
    }
  }, [dispatch, allCards]);

  // סינון כרטיסים לפי מונח חיפוש
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCards(allCards);
      setCurrentPage(1);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allCards.filter(
      (card) =>
        card.title.toLowerCase().includes(term) ||
        card.subtitle.toLowerCase().includes(term) ||
        card.description.toLowerCase().includes(term) ||
        card.address.city.toLowerCase().includes(term) ||
        card.address.country.toLowerCase().includes(term),
    );

    setFilteredCards(filtered);
    setCurrentPage(1);
  }, [searchTerm, allCards]);

  // חישוב דפדוף
  const totalCards = filteredCards.length;
  const totalPages = Math.ceil(totalCards / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const displayedCards = filteredCards.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE,
  );

  // טיפול בחיפוש
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
          Welcome to BCard
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Discover business cards from professionals around the world. Create
          your own business card and share your contact information easily.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mb-8 max-w-xl">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500">
                <FaSearch />
              </span>
            </div>
            <TextInput
              type="search"
              placeholder="Search for cards by title, location, or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
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
            className="px-3 py-1"
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
                className="px-3 py-1"
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
            className="px-3 py-1"
          >
            &raquo;
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
