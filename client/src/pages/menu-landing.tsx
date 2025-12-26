import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { mainCategories } from "@/lib/menu-categories";
import HamburgerMenu from "@/components/hamburger-menu";

import carouselImg1 from "@assets/5_1766732327395.JPG";
import carouselImg2 from "@assets/1_1766732327396.JPG";
import carouselImg3 from "@assets/2_1766732327396.JPG";
import carouselImg4 from "@assets/3_1766732327397.JPG";
import carouselImg5 from "@assets/4_1766732327397.JPG";

import premiumFoodImg from "@assets/image_1765866040643.png";
import premiumBarImg from "@assets/stock_images/premium_whisky_cockt_68b3295e.jpg";
import premiumDessertsImg from "@assets/image_1765866710467.png";
import premiumMocktailsImg from "@assets/stock_images/premium_colorful_moc_1a15dee9.jpg";
import logoImg from "@assets/Untitled_design_(20)_1765720426678.png";

const promotionalImages = [
  { id: 1, src: carouselImg1, alt: "Restaurant Interior" },
  { id: 2, src: carouselImg2, alt: "Bar & Dining Area" },
  { id: 3, src: carouselImg3, alt: "Modern Ambiance" },
  { id: 4, src: carouselImg4, alt: "Contemporary Dining" },
  { id: 5, src: carouselImg5, alt: "Elegant Seating" },
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
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % promotionalImages.length,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/menu/${categoryId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#151515" }}>
      <header
        className="sticky top-0 z-30 elegant-shadow"
        style={{ backgroundColor: "#151515" }}
      >
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
                className="h-32 sm:h-36 md:h-40 w-auto object-contain"
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

        <HamburgerMenu
          isOpen={showHamburgerMenu}
          onClose={() => setShowHamburgerMenu(false)}
          onCategoryClick={handleCategoryClick}
        />
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
            </motion.div>
          ))}

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
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
              <div className="absolute inset-0 flex flex-col items-center justify-start p-4 pt-8">
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider uppercase"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#FFFFFF",
                    textShadow:
                      "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
                    letterSpacing: "3px",
                  }}
                >
                  {category.displayLabel}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
