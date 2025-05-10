// src/pages/About/About.tsx
import { Card } from "flowbite-react";
import { FaHeart, FaCreditCard, FaSearch, FaUserTie } from "react-icons/fa";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-800 dark:text-white">
          About BussinesCards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome to BussinesCards - a platform for creating, sharing, and
          discovering business cards digitally. Our mission is to help
          professionals connect and showcase their business information in a
          modern, eco-friendly way.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="h-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-4xl text-blue-600">
              <FaCreditCard />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
              Create Digital Cards
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Business users can create beautiful digital business cards to
              share their contact information, services, and more.
            </p>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-4xl text-blue-600">
              <FaSearch />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
              Find Professionals
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse through a diverse collection of business cards to find
              professionals and services you need.
            </p>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-4xl text-blue-600">
              <FaHeart />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
              Save Favorites
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of businesses you're interested in by adding their
              cards to your favorites collection.
            </p>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-4xl text-blue-600">
              <FaUserTie />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
              Business Account
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upgrade to a business account to create and manage your own
              business cards.
            </p>
          </div>
        </Card>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          How to Use BussinesCards
        </h2>

        <div className="mb-8 space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              For Regular Users
            </h3>
            <ul className="mt-2 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
              <li>Browse through all cards on the homepage</li>
              <li>Use the search feature to find specific businesses</li>
              <li>Save interesting business cards to your favorites</li>
              <li>View detailed information for any business card</li>
            </ul>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              For Business Users
            </h3>
            <ul className="mt-2 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
              <li>Create your own business cards with detailed information</li>
              <li>Manage all your cards from the "My Cards" section</li>
              <li>Edit or delete your cards as needed</li>
              <li>Track which users have liked your business cards</li>
            </ul>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              For Administrators
            </h3>
            <ul className="mt-2 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
              <li>Manage all users from the admin panel</li>
              <li>Change user business status</li>
              <li>Delete users when necessary</li>
              <li>Monitor platform activity</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-300">
          BussinesCards is a project developed using React, Redux, and modern
          web technologies. For any questions or support, please contact us.
        </p>
      </div>
    </div>
  );
};

export default About;
