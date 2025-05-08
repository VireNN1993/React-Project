// src/pages/CreateCard/CreateCard.tsx
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { cardSchema } from "../../utils/validationSchemas";
import { CreateCardFormData } from "../../types/Card";
import axios from "axios";
import { TextInput, Button, Textarea } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
// שימוש ב-BASE_URL מתוך שירות קיים
import { BASE_URL } from "../../services/userService";

const CreateCard = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // בדיקת הרשאות משתמש
  const { isLoggedIn, isBusiness } = useSelector(
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

  const onSubmit = async (data: CreateCardFormData) => {
    if (!isLoggedIn || !isBusiness) {
      toast.error("Only business users can create cards.");
      return;
    }

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
          url:
            data.imageUrl ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
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

      await axios.post(`${BASE_URL}/cards`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ניקוי טופס והצגת הודעת הצלחה
      reset();
      toast.success("Card created successfully!");

      // ניווט לאחר המתנה קצרה
      setTimeout(() => {
        navigate("/my-cards");
      }, 1500);
    } catch (error: unknown) {
      // טיפול משופר בשגיאות
      if (axios.isAxiosError(error)) {
        // שגיאת Axios - יש לנו גישה ל-response
        const errorMessage =
          error.response?.data?.message || "Failed to create card.";
        console.error("API Error:", errorMessage);
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        // שגיאת JavaScript רגילה
        console.error("Error:", error.message);
        toast.error(error.message);
      } else {
        // שגיאה אחרת בלתי ידועה
        console.error("Unknown error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // הגנה מפני משתמשים לא מורשים
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto mt-10 text-center">
        <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700">
          <span className="font-medium">Authentication required!</span> Please
          sign in to continue.
        </div>
        <Button className="mt-4" onClick={() => navigate("/signin")}>
          Sign In
        </Button>
      </div>
    );
  }

  if (!isBusiness) {
    return (
      <div className="container mx-auto mt-10 text-center">
        <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700">
          <span className="font-medium">Permission denied!</span> Only business
          users can create cards.
        </div>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 max-w-2xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Create New Business Card
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
            {isSubmitting ? "Creating..." : "Create Card"}
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

export default CreateCard;
