import { motion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X, Phone, Clock, MapPin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getMainCategory, mainCategories } from "@/lib/menu-categories";

import logoImg from "@assets/Untitled_design_(20)_1765720426678.png";
import signatureMocktailsImg from "@assets/image_1765865243299.png";
import softBeveragesImg from "@assets/image_1765865174044.png";

import blendedWhiskyImg from "@assets/image_1765863859085.png";
import blendedScotchWhiskyImg from "@assets/image_1765863885349.png";
import americanIrishWhiskeyImg from "@assets/image_1765863999733.png";
import singleMaltWhiskyImg from "@assets/image_1765864037279.png";
import vodkaImg from "@assets/image_1765864071875.png";
import ginImg from "@assets/image_1765864086244.png";
import rumImg from "@assets/image_1765864174592.png";
import tequilaImg from "@assets/image_1765864191436.png";
import cognacBrandyImg from "@assets/image_1765864219488.png";
import liqueursImg from "@assets/image_1765864273630.png";
import sparklingWineImg from "@assets/image_1765864313974.png";
import whiteWinesImg from "@assets/image_1765864338087.png";
import roseWinesImg from "@assets/image_1765864363438.png";
import redWinesImg from "@assets/image_1765864393053.png";
import dessertWinesImg from "@assets/image_1765864417149.png";
import portWineImg from "@assets/image_1765864441224.png";

import nibblesImg from "@assets/image_1765861653339.png";
import titbitsImg from "@assets/image_1765861734899.png";
import soupsImg from "@assets/image_1765861784186.png";
import saladsImg from "@assets/image_1765861993529.png";
import startersImg from "@assets/image_1765862083770.png";
import charcoalImg from "@assets/image_1765862103291.png";
import pastaImg from "@assets/image_1765862151515.png";
import pizzaImg from "@assets/image_1765862533698.png";
import slidersImg from "@assets/image_1765862611064.png";
import entreeImg from "@assets/image_1765862689473.png";
import baoDimsumImg from "@assets/image_1765862739110.png";
import curriesImg from "@assets/image_1765862783811.png";
import biryaniImg from "@assets/image_1765862804295.png";
import riceImg from "@assets/image_1765862832303.png";
import dalsImg from "@assets/image_1765862864030.png";
import breadsImg from "@assets/image_1765862911256.png";
import asianMainsImg from "@assets/image_1765862935848.png";
import thaiBowlsImg from "@assets/image_1765862959084.png";
import riceNoodlesImg from "@assets/image_1765862986138.png";
import sizzlersImg from "@assets/image_1765863042831.png";

const subcategoryImages: Record<string, string> = {
  "signature-mocktails": signatureMocktailsImg,
  "soft-beverages": softBeveragesImg,
  "blended-whisky": blendedWhiskyImg,
  "blended-scotch-whisky": blendedScotchWhiskyImg,
  "american-irish-whiskey": americanIrishWhiskeyImg,
  "single-malt-whisky": singleMaltWhiskyImg,
  vodka: vodkaImg,
  gin: ginImg,
  rum: rumImg,
  tequila: tequilaImg,
  "cognac-brandy": cognacBrandyImg,
  liqueurs: liqueursImg,
  "sparkling-wine": sparklingWineImg,
  "white-wines": whiteWinesImg,
  "rose-wines": roseWinesImg,
  "red-wines": redWinesImg,
  "dessert-wines": dessertWinesImg,
  "port-wine": portWineImg,
  nibbles: nibblesImg,
  titbits: titbitsImg,
  soups: soupsImg,
  salads: saladsImg,
  starters: startersImg,
  charcoal: charcoalImg,
  pasta: pastaImg,
  pizza: pizzaImg,
  sliders: slidersImg,
  entree: entreeImg,
  "bao-dimsum": baoDimsumImg,
  curries: curriesImg,
  biryani: biryaniImg,
  rice: riceImg,
  dals: dalsImg,
  breads: breadsImg,
  "asian-mains": asianMainsImg,
  "thai-bowls": thaiBowlsImg,
  "rice-noodles": riceNoodlesImg,
  sizzlers: sizzlersImg,
};

export default function CategorySelection() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string }>();
  const categoryId = params.category || "mocktails";
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">(() => {
    if (categoryId === "food") {
      try {
        const saved = localStorage.getItem("foodVegFilter");
        return (saved as "all" | "veg" | "non-veg") || "all";
      } catch {
        return "all";
      }
    }
    return "all";
  });

  const mainCategory = getMainCategory(categoryId);
  const subcategories = mainCategory?.subcategories || [];

  const handleSubcategoryClick = (subcategoryId: string) => {
    const filterParam = vegFilter !== "all" ? `?filter=${vegFilter}` : "";
    setLocation(`/menu/${categoryId}/${subcategoryId}${filterParam}`);
  };

  const handleFilterChange = (newFilter: "all" | "veg" | "non-veg") => {
    setVegFilter(newFilter);
    try {
      localStorage.setItem("foodVegFilter", newFilter);
    } catch {
      // localStorage might not be available in some environments
    }
  };

  const handleCategoryClick = (catId: string) => {
    setLocation(`/menu/${catId}`);
  };

  if (!mainCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#151515" }}>
        <p className="text-white">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#151515" }}>
      <header className="sticky top-0 z-30 elegant-shadow" style={{ backgroundColor: "#151515" }}>
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/menu")}
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
                  style={{ color: "var(--elegant-gold)", fontFamily: "'Cormorant Garamond', serif" }}
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
                    style={{ color: "var(--elegant-black)", fontFamily: "'Cormorant Garamond', serif" }}
                    data-testid={`button-category-${category.id}`}
                  >
                    {category.displayLabel}
                  </motion.button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
                  style={{ color: "var(--elegant-gold)", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Restaurant Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Barrel Born
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
                        Thane, Maharashtra
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Contact Us
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
                        For reservations & orders
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        11:00 AM - 11:00 PM
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
                        Open all days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaInstagram className="h-5 w-5 text-gray-600" />
                    <div>
                      <button
                        onClick={() => window.open("https://www.instagram.com/barrelborn_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", "_blank", "noopener,noreferrer")}
                        className="font-semibold text-blue-600 hover:underline"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        @barrelborn_
                      </button>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8 relative">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-wider"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#C9A55C",
              letterSpacing: "3px",
            }}
          >
            {mainCategory.displayLabel}
          </h1>

          {categoryId === "food" && (
            <div 
              className="absolute right-0 inline-flex rounded-full p-0.5 items-center gap-0.5"
              style={{ backgroundColor: "rgba(201, 165, 92, 0.15)", border: "1px solid #C9A55C" }}
            >
              <button
                onClick={() => handleFilterChange("all")}
                className="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                data-testid="filter-all"
                style={
                  vegFilter === "all"
                    ? { backgroundColor: "white", color: "black", fontSize: "12px", lineHeight: "1.2" }
                    : { color: "#C9A55C", fontSize: "12px", lineHeight: "1.2" }
                }
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("veg")}
                className="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                data-testid="filter-veg"
                style={
                  vegFilter === "veg"
                    ? { backgroundColor: "#22C55E", color: "white", fontSize: "12px", lineHeight: "1.2" }
                    : { color: "#C9A55C", fontSize: "12px", lineHeight: "1.2" }
                }
              >
                Veg
              </button>
              <button
                onClick={() => handleFilterChange("non-veg")}
                className="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                data-testid="filter-non-veg"
                style={
                  vegFilter === "non-veg"
                    ? { backgroundColor: "#EF4444", color: "white", fontSize: "12px", lineHeight: "1.2" }
                    : { color: "#C9A55C", fontSize: "12px", lineHeight: "1.2" }
                }
              >
                Non-Veg
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {subcategories.map((subcat, index) => (
            <motion.button
              key={subcat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubcategoryClick(subcat.id)}
              className="relative rounded-xl overflow-hidden group"
              style={{ aspectRatio: "1/1.3" }}
              data-testid={`tile-${subcat.id}`}
            >
              <img
                src={subcategoryImages[subcat.id] || signatureMocktailsImg}
                alt={subcat.displayLabel}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-8">
                <h3
                  className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-center"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif", 
                    color: "#FFFFFF", 
                    textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
                    letterSpacing: "2px"
                  }}
                >
                  {subcat.displayLabel}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}