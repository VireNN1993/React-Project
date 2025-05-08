// src/pages/CardDetails/CardDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CardType } from "../../types/Card";
import { Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { BASE_URL } from "../../services/userService";
import {
  FaHeart,
  FaRegHeart,
  FaPencilAlt,
  FaTrash,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleLike } from "../../redux/slices/cardsSlice";

const CardDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [card, setCard] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isLoggedIn, userData } = useSelector(
    (state: RootState) => state.user,
  );

  const isOwner = userData?._id && card?.user_id === userData._id;
  const isLiked = userData?._id && card?.likes.includes(userData._id);

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data } = await axios.get<CardType>(`${BASE_URL}/cards/${id}`);
        setCard(data);
      } catch (error: unknown) {
        console.error("Failed to fetch card details:", error);
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message || "Failed to load card details",
          );
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleLike = async () => {
    if (!isLoggedIn || !userData?._id || !card) {
      toast.info("Please sign in to like cards");
      return;
    }

    try {
      // UI התגובה המיידית ב
      dispatch(toggleLike({ cardId: card._id, userId: userData._id }));

      // עדכון בצד שרת
      await axios.patch(
        `${BASE_URL}/cards/${card._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // עדכון מצב הקומפוננטה המקומי
      setCard((prevCard) => {
        if (!prevCard) return null;

        const likes = [...prevCard.likes];
        const index = likes.indexOf(userData._id);

        if (index === -1) {
          likes.push(userData._id);
        } else {
          likes.splice(index, 1);
        }

        return { ...prevCard, likes };
      });
    } catch (error) {
      toast.error("Failed to update like status");
      console.error("Like operation failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || !card) return;

    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/cards/${card._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Card deleted successfully");
      navigate("/my-cards");
    } catch (error) {
      toast.error("Failed to delete card");
      console.error("Delete operation failed:", error);
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
      <div className="container mx-auto mt-10 text-center">
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
          <span className="font-medium">Error:</span> {error}
        </div>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container mx-auto mt-10 text-center">
        <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700">
          <span className="font-medium">Card not found!</span>
        </div>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const fullAddress = `${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.country}`;

  return (
    <div className="container mx-auto my-10 max-w-4xl px-4">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
        {/* כותרת עם כפתורים */}
        <div className="relative">
          <img
            src={card.image.url || "https://placehold.co/600x300?text=No+Image"}
            alt={card.image.alt || card.title}
            className="h-64 w-full object-cover"
          />

          <div className="absolute top-4 right-4 flex gap-2">
            {isLoggedIn && (
              <button
                onClick={handleLike}
                className="rounded-full bg-white p-2 text-lg shadow transition hover:bg-gray-100"
              >
                {isLiked ? (
                  <span className="text-red-500">
                    <FaHeart />
                  </span>
                ) : (
                  <span className="text-gray-600">
                    <FaRegHeart />
                  </span>
                )}
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/edit-card/${card._id}`)}
                  className="rounded-full bg-white p-2 text-lg shadow transition hover:bg-gray-100"
                >
                  <span className="text-blue-600">
                    <FaPencilAlt />
                  </span>
                </button>

                <button
                  onClick={handleDelete}
                  className="rounded-full bg-white p-2 text-lg shadow transition hover:bg-gray-100"
                >
                  <span className="text-red-600">
                    <FaTrash />
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* תוכן הכרטיס */}
        <div className="p-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
            {card.title}
          </h1>
          <h2 className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            {card.subtitle}
          </h2>

          <p className="mb-6 whitespace-pre-line text-gray-700 dark:text-gray-300">
            {card.description}
          </p>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-blue-600">
                <FaPhone />
              </span>
              <a href={`tel:${card.phone}`}>{card.phone}</a>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-blue-600">
                <FaEnvelope />
              </span>
              <a href={`mailto:${card.email}`}>{card.email}</a>
            </div>

            {card.web && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-blue-600">
                  <FaGlobe />
                </span>
                <a
                  href={
                    card.web.startsWith("http")
                      ? card.web
                      : `https://${card.web}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card.web}
                </a>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-blue-600">
                <FaMapMarkerAlt />
              </span>
              <span>{fullAddress}</span>
            </div>
          </div>

          {/* מפה - בונוס */}
          <div className="mb-6 h-64 rounded-lg bg-gray-200">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="rounded-lg"
            ></iframe>
          </div>

          <div className="mt-6 flex justify-between">
            <Button color="light" onClick={() => navigate(-1)}>
              Back
            </Button>

            {isLoggedIn && (
              <Button color={isLiked ? "light" : "blue"} onClick={handleLike}>
                {isLiked ? (
                  <>
                    <span className="mr-2 text-red-500">
                      <FaHeart />
                    </span>
                    Remove from Favorites
                  </>
                ) : (
                  <>
                    <span className="mr-2">
                      <FaRegHeart />
                    </span>
                    Add to Favorites
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
