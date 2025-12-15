import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X, Phone, Clock, MapPin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { mainCategories } from "@/lib/menu-categories";

import restaurantInterior1 from "@assets/stock_images/elegant_restaurant_i_e8a94033.jpg";
import restaurantInterior2 from "@assets/stock_images/elegant_restaurant_i_114f645e.jpg";
import restaurantInterior3 from "@assets/stock_images/elegant_restaurant_i_46bc3b6c.jpg";
import gourmetFood1 from "@assets/stock_images/gourmet_food_plating_4fa14995.jpg";
import gourmetFood2 from "@assets/stock_images/gourmet_food_plating_6ae9981b.jpg";

import premiumFoodImg from "@assets/generated_images/premium_burger_dark_background.png";
import premiumBarImg from "@assets/stock_images/premium_whisky_cockt_68b3295e.jpg";
import premiumDessertsImg from "@assets/generated_images/chocolate_dessert_dark_background.png";
import premiumMocktailsImg from "@assets/stock_images/premium_colorful_moc_1a15dee9.jpg";
import logoImg from "/images/logo.png";

const promotionalImages = [
  { id: 1, src: restaurantInterior1, alt: "Elegant Restaurant Interior" },
  { id: 2, src: gourmetFood1, alt: "Gourmet Food Plating" },
  { id: 3, src: restaurantInterior2, alt: "Fine Dining Ambiance" },
  { id: 4, src: gourmetFood2, alt: "Delicious Restaurant Dishes" },
  { id: 5, src: restaurantInterior3, alt: "Restaurant Bar Area" },
];

const categoryImages: Record<string, string> = {
  food: premiumFoodImg,
  bar: premiumBarImg,
  desserts: premiumDessertsImg,
  mocktails: premiumMocktailsImg,
};

export default function MenuLanding() {
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % promotionalImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/menu/${categoryId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#151515" }}>
      <header className="sticky top-0 z-30 elegant-shadow" style={{ backgroundColor: "#151515" }}>
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "#DCD4C8" }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src={logoImg} 
                alt="Barrel Born Logo" 
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                data-testid="img-logo"
              />
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                style={{ color: "#DCD4C8" }}
                data-testid="button-menu-toggle"
              >
                {showHamburgerMenu ? (
                  <X className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                ) : (
                  <MenuIcon className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {showHamburgerMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
          >
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold"
                  style={{ color: "var(--elegant-gold)", fontFamily: "Open Sans, sans-serif" }}
                >
                  Menu Categories
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHamburgerMenu(false)}
                  className="hover:bg-transparent"
                  style={{ color: "var(--elegant-gold)" }}
                  data-testid="button-close-menu"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {mainCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleCategoryClick(category.id);
                      setShowHamburgerMenu(false);
                    }}
                    className="p-4 rounded-lg text-sm font-semibold transition-all duration-200 border-2 border-gray-200 bg-white hover:border-yellow-300"
                    style={{ color: "var(--elegant-black)", fontFamily: "Open Sans, sans-serif" }}
                    data-testid={`button-category-${category.id}`}
                  >
                    {category.displayLabel}
                  </motion.button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
                  style={{ color: "var(--elegant-gold)", fontFamily: "Open Sans, sans-serif" }}
                >
                  Restaurant Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-800" style={{ fontFamily: "Open Sans, sans-serif" }}>
                        Barrel Born
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "Open Sans, sans-serif" }}>
                        Thane, Maharashtra
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-800" style={{ fontFamily: "Open Sans, sans-serif" }}>
                        Contact Us
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "Open Sans, sans-serif" }}>
                        For reservations & orders
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-800" style={{ fontFamily: "Open Sans, sans-serif" }}>
                        11:00 AM - 11:00 PM
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "Open Sans, sans-serif" }}>
                        Open all days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaInstagram className="h-5 w-5 text-gray-600" />
                    <div>
                      <button
                        onClick={() => window.open("https://instagram.com/barrelborn", "_blank", "noopener,noreferrer")}
                        className="font-semibold text-blue-600 hover:underline"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        @barrelborn
                      </button>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "Open Sans, sans-serif" }}>
                        Follow us for updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4">
        <div className="relative h-56 sm:h-64 md:h-72 rounded-xl overflow-hidden mb-6">
          {promotionalImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Welcome to Barrel Born
                </h2>
                <p className="text-sm opacity-90">Experience culinary excellence</p>
              </div>
            </motion.div>
          ))}

          <div className="absolute bottom-2 right-4 flex space-x-1.5">
            {promotionalImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                }`}
                data-testid={`carousel-dot-${index}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {mainCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.id)}
              className="relative rounded-xl overflow-hidden group"
              style={{ aspectRatio: "1/1.3" }}
              data-testid={`tile-${category.id}`}
            >
              <img
                src={categoryImages[category.id]}
                alt={category.displayLabel}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-8">
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider uppercase"
                  style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    color: "#FFFFFF", 
                    textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
                    letterSpacing: "3px"
                  }}
                >
                  {category.displayLabel}
                </h3>
                <p 
                  className="text-xs sm:text-sm text-center mt-2 font-medium tracking-wide"
                  style={{ 
                    color: "#FFFFFF", 
                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                    opacity: 0.95
                  }}
                >
                  {category.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
