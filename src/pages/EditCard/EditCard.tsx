// src/pages/EditCard/EditCard.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { cardSchema } from "../../utils/validationSchemas";
import { CreateCardFormData, CardType } from "../../types/Card";
import axios from "axios";
import { TextInput, Button, Textarea, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { BASE_URL } from "../../services/userService";

const EditCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // בדיקת הרשאות משתמש
  const { isLoggedIn, userData } = useSelector(
    (state: RootState) => state.user,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCardFormData>({
    resolver: joiResolver(cardSchema),
  });

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        const { data } = await axios.get<CardType>(`${BASE_URL}/cards/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // בדוק אם המשתמש הוא הבעלים של הכרטיס
        if (userData?._id !== data.user_id) {
          setError("You don't have permission to edit this card");
          return;
        }

        // המר את נתוני הכרטיס למבנה של הטופס
        reset({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          phone: data.phone,
          email: data.email,
          web: data.web || "",
          imageUrl: data.image.url,
          imageAlt: data.image.alt,
          state: data.address.state || "",
          country: data.address.country,
          city: data.address.city,
          street: data.address.street,
          houseNumber: data.address.houseNumber,
          zip: data.address.zip,
        });
      } catch (error: unknown) {
        console.error("Failed to fetch card:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to load card");
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
  }, [id, reset, userData?._id]);

  const onSubmit = async (data: CreateCardFormData) => {
    if (!isLoggedIn || !id) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const payload = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        phone: data.phone,
        email: data.email,
        web: data.web || "",
        image: {
          url: data.imageUrl || "https://placehold.co/600x300?text=No+Image",
          alt: data.imageAlt || "Business Card Image",
        },
        address: {
          state: data.state || "",
          country: data.country,
          city: data.city,
          street: data.street,
          houseNumber: data.houseNumber,
          zip: data.zip || 0,
        },
      };

      await axios.put(`${BASE_URL}/cards/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Card updated successfully!");

      // ניווט לאחר המתנה קצרה
      setTimeout(() => {
        navigate(`/card/${id}`);
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update card.";
        console.error("API Error:", errorMessage);
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
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
        <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700">
          <span className="font-medium">Error:</span> {error}
        </div>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 max-w-2xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Edit Business Card
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <TextInput {...register("title")} placeholder="Title" />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <TextInput {...register("subtitle")} placeholder="Subtitle" />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.subtitle.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            {...register("description")}
            placeholder="Description"
            rows={4}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <TextInput {...register("phone")} placeholder="Phone" />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <TextInput {...register("email")} placeholder="Email" />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <TextInput {...register("web")} placeholder="Website (optional)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            {...register("imageUrl")}
            placeholder="Image URL (optional)"
          />
          <TextInput
            {...register("imageAlt")}
            placeholder="Image Alt (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput {...register("state")} placeholder="State (optional)" />
          <div>
            <TextInput {...register("country")} placeholder="Country" />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInput {...register("city")} placeholder="City" />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
          <div>
            <TextInput {...register("street")} placeholder="Street" />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">
                {errors.street.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInput
              {...register("houseNumber")}
              type="number"
              placeholder="House Number"
            />
            {errors.houseNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.houseNumber.message}
              </p>
            )}
          </div>
          <TextInput
            {...register("zip")}
            type="number"
            placeholder="ZIP (optional)"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            color="blue"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Updating..." : "Update Card"}
          </Button>
          <Button
            color="light"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="w-1/3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCard;
