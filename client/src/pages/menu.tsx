import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Phone,
  Clock,
  MapPin,
  Mic,
  MicOff,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DishCard from "@/components/dish-card";
import type { MenuItem } from "@shared/schema";

// Import generated category images
import nibblesImg from "@assets/generated_images/nibbles_snacks_appetizer.png";
import titbitsImg from "@assets/generated_images/titbits_finger_food.png";
import soupsImg from "@assets/generated_images/soups_hot_bowl.png";
import saladsImg from "@assets/generated_images/salads_fresh_vegetables.png";
import startersImg from "@assets/generated_images/starters_appetizers_fried.png";
import charcoalImg from "@assets/generated_images/charcoal_grilled_kebabs.png";
import pastaImg from "@assets/generated_images/pasta_italian_dish.png";
import pizzaImg from "@assets/generated_images/pizza_italian_cheese.png";
import slidersImg from "@assets/generated_images/sliders_mini_burgers.png";
import entreeImg from "@assets/generated_images/entree_main_course.png";
import baoDimsumImg from "@assets/generated_images/bao_dimsum_dumplings.png";
import curriesImg from "@assets/generated_images/curries_indian_spiced.png";
import biryaniImg from "@assets/generated_images/biryani_aromatic_rice.png";
import riceImg from "@assets/generated_images/rice_steamed_bowl.png";
import dalsImg from "@assets/generated_images/dals_lentil_curry.png";
import breadsImg from "@assets/generated_images/breads_indian_naan.png";
import asianMainsImg from "@assets/generated_images/asian_mains_stir-fry.png";
import thaiBowlsImg from "@assets/generated_images/thai_bowls_noodles.png";
import riceNoodlesImg from "@assets/generated_images/rice_noodles_asian.png";
import sizzlersImg from "@assets/generated_images/sizzlers_hot_plate.png";
import blendedWhiskyImg from "@assets/generated_images/blended_whisky_bottle.png";
import blendedScotchWhiskyImg from "@assets/generated_images/scotch_whisky_premium.png";
import americanIrishWhiskeyImg from "@assets/generated_images/american_irish_whiskey.png";
import singleMaltWhiskyImg from "@assets/generated_images/single_malt_whisky.png";
import vodkaImg from "@assets/generated_images/vodka_clear_spirit.png";
import ginImg from "@assets/generated_images/gin_botanical_spirit.png";
import rumImg from "@assets/generated_images/rum_caribbean_spirit.png";
import tequilaImg from "@assets/generated_images/tequila_agave_spirit.png";
import cognacBrandyImg from "@assets/generated_images/cognac_brandy_bottle.png";
import liqueursImg from "@assets/generated_images/liqueurs_colorful_bottles.png";
import sparklingWineImg from "@assets/generated_images/sparkling_wine_champagne.png";
import whiteWinesImg from "@assets/generated_images/white_wines_bottle.png";
import roseWinesImg from "@assets/generated_images/rose_wines_pink.png";
import redWinesImg from "@assets/generated_images/red_wines_bottle.png";
import dessertWinesImg from "@assets/generated_images/dessert_wines_sweet.png";
import portWineImg from "@assets/generated_images/port_wine_bottle.png";
import signatureMocktailsImg from "@assets/generated_images/signature_mocktails_drinks.png";
import softBeveragesImg from "@assets/generated_images/soft_beverages_drinks.png";

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Import restaurant stock images for carousel
import restaurantInterior1 from "@assets/stock_images/elegant_restaurant_i_e8a94033.jpg";
import restaurantInterior2 from "@assets/stock_images/elegant_restaurant_i_114f645e.jpg";
import restaurantInterior3 from "@assets/stock_images/elegant_restaurant_i_46bc3b6c.jpg";
import gourmetFood1 from "@assets/stock_images/gourmet_food_plating_4fa14995.jpg";
import gourmetFood2 from "@assets/stock_images/gourmet_food_plating_6ae9981b.jpg";

// Promotional images for the carousel - Restaurant ambiance and food
const promotionalImages = [
  {
    id: 1,
    src: restaurantInterior1,
    alt: "Elegant Restaurant Interior",
  },
  {
    id: 2,
    src: gourmetFood1,
    alt: "Gourmet Food Plating",
  },
  {
    id: 3,
    src: restaurantInterior2,
    alt: "Fine Dining Ambiance",
  },
  {
    id: 4,
    src: gourmetFood2,
    alt: "Delicious Restaurant Dishes",
  },
  {
    id: 5,
    src: restaurantInterior3,
    alt: "Restaurant Bar Area",
  },
];

// Now each category has both a display label and the actual MongoDB category name
const categories = [
  { id: "nibbles", displayLabel: "Nibbles", dbCategory: "nibbles" },
  { id: "titbits", displayLabel: "Titbits", dbCategory: "titbits" },
  { id: "soups", displayLabel: "Soups", dbCategory: "soups" },
  { id: "salads", displayLabel: "Salads", dbCategory: "salads" },
  { id: "starters", displayLabel: "Starters", dbCategory: "starters" },
  { id: "charcoal", displayLabel: "Charcoal", dbCategory: "charcoal" },
  { id: "pasta", displayLabel: "Pasta", dbCategory: "pasta" },
  { id: "pizza", displayLabel: "Pizza", dbCategory: "pizza" },
  { id: "sliders", displayLabel: "Sliders", dbCategory: "sliders" },
  { id: "entree", displayLabel: "Entree", dbCategory: "entree" },
  { id: "bao-dimsum", displayLabel: "Bao-Dimsum", dbCategory: "bao-dimsum" },
  { id: "curries", displayLabel: "Curries", dbCategory: "curries" },
  { id: "biryani", displayLabel: "Biryani", dbCategory: "biryani" },
  { id: "rice", displayLabel: "Rice", dbCategory: "rice" },
  { id: "dals", displayLabel: "Dals", dbCategory: "dals" },
  { id: "breads", displayLabel: "Breads", dbCategory: "breads" },
  { id: "asian-mains", displayLabel: "Asian-Mains", dbCategory: "asian-mains" },
  { id: "thai-bowls", displayLabel: "Thai-Bowls", dbCategory: "thai-bowls" },
  {
    id: "rice-noodles",
    displayLabel: "Rice-Noodles",
    dbCategory: "rice-noodles",
  },
  { id: "sizzlers", displayLabel: "Sizzlers", dbCategory: "sizzlers" },
  {
    id: "blended-whisky",
    displayLabel: "Blended Whisky",
    dbCategory: "blended-whisky",
  },
  {
    id: "blended-scotch-whisky",
    displayLabel: "Blended Scotch Whisky",
    dbCategory: "blended-scotch-whisky",
  },
  {
    id: "american-irish-whiskey",
    displayLabel: "American & Irish Whiskey",
    dbCategory: "american-irish-whiskey",
  },
  {
    id: "single-malt-whisky",
    displayLabel: "Single Malt Whisky",
    dbCategory: "single-malt-whisky",
  },
  { id: "vodka", displayLabel: "Vodka", dbCategory: "vodka" },
  { id: "gin", displayLabel: "Gin", dbCategory: "gin" },
  { id: "rum", displayLabel: "Rum", dbCategory: "rum" },
  { id: "tequila", displayLabel: "Tequila", dbCategory: "tequila" },
  {
    id: "cognac-brandy",
    displayLabel: "Cognac & Brandy",
    dbCategory: "cognac-brandy",
  },
  { id: "liqueurs", displayLabel: "Liqueurs", dbCategory: "liqueurs" },
  {
    id: "sparkling-wine",
    displayLabel: "Sparkling Wine",
    dbCategory: "sparkling-wine",
  },
  { id: "white-wines", displayLabel: "White Wines", dbCategory: "white-wines" },
  { id: "rose-wines", displayLabel: "Rosé Wines", dbCategory: "rose-wines" },
  { id: "red-wines", displayLabel: "Red Wines", dbCategory: "red-wines" },
  {
    id: "dessert-wines",
    displayLabel: "Dessert Wines",
    dbCategory: "dessert-wines",
  },
  { id: "port-wine", displayLabel: "Port Wine", dbCategory: "port-wine" },
  {
    id: "signature-mocktails",
    displayLabel: "Signature Mocktails",
    dbCategory: "signature-mocktails",
  },
  {
    id: "soft-beverages",
    displayLabel: "Soft Beverages",
    dbCategory: "soft-beverages",
  },
];

const filterTypes = [
  { id: "all", label: "All", color: "var(--royal-gold)" },
  { id: "veg", label: "Veg", color: "var(--royal-emerald)" },
  { id: "non-veg", label: "Non-Veg", color: "var(--royal-maroon)" },
];

export default function Menu() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("nibbles");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  // Initialize Speech Recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);

        // Show user-friendly error message
        if (event.error === "not-allowed") {
          alert(
            "Voice search permission denied. Please allow microphone access and try again.",
          );
        } else if (event.error === "no-speech") {
          alert("No speech detected. Please try speaking again.");
        } else {
          alert("Voice search failed. Please try again or type your search.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
      setVoiceSearchSupported(true);
    } else {
      setVoiceSearchSupported(false);
    }
  }, []);

  // Voice Search Function
  const startVoiceSearch = () => {
    if (speechRecognition && voiceSearchSupported) {
      try {
        speechRecognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
        alert("Voice search failed to start. Please try again.");
      }
    } else {
      alert(
        "Voice search is not supported in your browser. Please use Chrome or Safari for the best experience.",
      );
    }
  };

  // Stop Voice Search
  const stopVoiceSearch = () => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
    }
  };

  // Create a mapping from category IDs to MongoDB category names
  const categoryIdToDbCategory = categories.reduce(
    (acc, category) => {
      acc[category.id] = category.dbCategory;
      return acc;
    },
    {} as Record<string, string>,
  );

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Convert activeCategory ID to actual MongoDB category name for comparison
      const activeCategoryDbName = categoryIdToDbCategory[activeCategory];

      // If there's a search query, search across all categories
      const matchesCategory = searchQuery.trim()
        ? true
        : item.category === activeCategoryDbName;

      const matchesFilter =
        filterType === "all" ||
        (filterType === "veg" && item.isVeg) ||
        (filterType === "non-veg" && !item.isVeg);

      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesFilter && matchesSearch;
    });
  }, [
    menuItems,
    activeCategory,
    filterType,
    searchQuery,
    categoryIdToDbCategory,
  ]);

  const cartItemCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const currentFilter = filterTypes.find((f) => f.id === filterType);

  // Auto-scroll carousel effect for images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % promotionalImages.length,
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Clear search when category changes (if you want this behavior)
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Optionally clear search when switching categories
    // setSearchQuery("");
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--elegant-cream)" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white elegant-shadow">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "var(--elegant-gold)" }}
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            {/* Centered Logo Text */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1
                className="font-bold"
                style={{
                  fontSize: "clamp(18px, 4vw, 28px)",
                  color: "#D97706",
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "1px",
                }}
              >
                BARREL BORN
              </h1>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
              {/* Instagram Button was here we removed it*/}

              {/* Hamburger Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                style={{ color: "var(--elegant-gold)" }}
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

        {/* Hamburger Menu Dropdown */}
        {showHamburgerMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
          >
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold"
                  style={{
                    color: "var(--elegant-gold)",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                >
                  Menu Categories
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHamburgerMenu(false)}
                  className="hover:bg-transparent"
                  style={{ color: "var(--elegant-gold)" }}
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleCategoryChange(category.id);
                      setShowHamburgerMenu(false);
                    }}
                    className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 border-2 ${
                      activeCategory === category.id
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-25"
                    }`}
                    style={{
                      color:
                        activeCategory === category.id
                          ? "var(--elegant-gold)"
                          : "var(--elegant-black)",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    {category.displayLabel}
                  </motion.button>
                ))}
              </div>

              {/* Restaurant Information */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
                  style={{
                    color: "var(--elegant-gold)",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                >
                  Restaurant Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p
                        className="font-semibold text-gray-800"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Barrel Born
                      </p>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Thane, Maharashtra
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p
                        className="font-semibold text-gray-800"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Contact Us
                      </p>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        For reservations & orders
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p
                        className="font-semibold text-gray-800"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        11:00 AM - 11:00 PM
                      </p>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Open all days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaInstagram className="h-5 w-5 text-gray-600" />
                    <div>
                      <button
                        onClick={() =>
                          window.open(
                            "https://instagram.com/barrelborn",
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                        className="font-semibold text-blue-600 hover:underline"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        @barrelborn
                      </button>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
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

      {/* Search Bar with Filter and Voice Search */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="flex justify-center">
          <div className="relative max-w-2xl w-full">
            {/* Mobile Layout - Inline buttons on the right */}
            <div className="md:hidden relative flex items-center">
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-yellow-400/50 h-12 text-sm font-sans pr-20 pl-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                style={{ color: "var(--elegant-black)" }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-400" />
              </div>

              {/* Mobile Voice Search Button */}
              {voiceSearchSupported && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                    className={`h-8 w-8 rounded-full transition-all duration-300 ${
                      isListening
                        ? "bg-red-100 hover:bg-red-200 text-red-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                    title={
                      isListening ? "Stop voice search" : "Start voice search"
                    }
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <MicOff className="h-3 w-3" />
                      </motion.div>
                    ) : (
                      <Mic className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}

              {/* Mobile Filter Button */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFilterDropdown(!showFilterDropdown);
                  }}
                  className="h-8 w-8 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl relative"
                  style={{ color: "var(--elegant-black)" }}
                >
                  <SlidersHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Desktop Layout - Original inline design */}
            <div className="hidden md:flex relative items-center">
              <Input
                type="text"
                placeholder="Search royal dishes across all categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-yellow-400/50 h-14 text-lg font-sans pr-44 pl-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ color: "var(--elegant-black)" }}
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>

              {/* Desktop Voice Search Button */}
              {voiceSearchSupported && (
                <div className="absolute right-32 top-1/2 transform -translate-y-1/2 z-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                    className={`h-10 w-10 rounded-full transition-all duration-300 ${
                      isListening
                        ? "bg-red-100 hover:bg-red-200 text-red-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                    title={
                      isListening ? "Stop voice search" : "Start voice search"
                    }
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <MicOff className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {/* Desktop Filter Button */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFilterDropdown(!showFilterDropdown);
                  }}
                  className="bg-white border-2 border-gray-300 hover:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400/50 h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-serif font-semibold flex items-center gap-1 sm:gap-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ color: "var(--elegant-black)" }}
                >
                  <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  {currentFilter?.id !== "all" && (
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white shadow-sm"
                      style={{
                        backgroundColor:
                          currentFilter?.id === "veg" ? "#22c55e" : "#ef4444",
                      }}
                    />
                  )}
                  <span className="hidden sm:inline">
                    {currentFilter?.label}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-400 transition-transform duration-200 ${showFilterDropdown ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Filter Dropdown - Shared between mobile and desktop */}
            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 md:right-3 top-full mt-2 w-40 bg-white border-2 border-gray-300 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                {filterTypes.map((type, index) => (
                  <button
                    key={type.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFilterType(type.id);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 font-serif font-semibold transition-all duration-200 ${
                      filterType === type.id ? "bg-gray-100" : ""
                    } ${index === 0 ? "rounded-t-2xl" : ""} ${index === filterTypes.length - 1 ? "rounded-b-2xl" : ""}`}
                    style={{ color: "var(--elegant-black)" }}
                  >
                    {type.id !== "all" && (
                      <div
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{
                          backgroundColor:
                            type.id === "veg" ? "#22c55e" : "#ef4444",
                        }}
                      />
                    )}
                    {type.id === "all" && (
                      <div className="w-3 h-3 rounded-full bg-gray-400 border border-white shadow-sm" />
                    )}
                    {type.label}
                    {filterType === type.id && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Promotional Image Carousel */}
      <div className="container mx-auto px-3 sm:px-4 mb-3 sm:mb-4">
        <div className="relative w-full h-40 sm:h-48 md:h-80 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
          <motion.div
            className="flex transition-transform duration-1000 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
            }}
          >
            {promotionalImages.map((image) => (
              <div
                key={image.id}
                className="min-w-full h-full relative"
                style={{ flexShrink: 0 }}
              >
                {/* Mobile/Tablet - SVG filling both width and height */}
                <svg
                  viewBox="0 0 800 450" // Adjust to your SVG's original dimensions
                  className="w-full h-full md:hidden"
                  preserveAspectRatio="none"
                >
                  <image
                    href={image.src}
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                  />
                </svg>

                {/* Desktop - SVG filling both width and height */}
                <svg
                  viewBox="0 0 800 450" // Adjust to your SVG's original dimensions
                  className="w-full h-full hidden md:block"
                  preserveAspectRatio="none"
                >
                  <image
                    href={image.src}
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                  />
                </svg>
              </div>
            ))}
          </motion.div>

          {/* Indicator dots */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
            {promotionalImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white shadow-lg scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-3 sm:px-4 mb-6 sm:mb-8 md:mb-10">
        <div className="flex space-x-2 sm:space-x-3 md:space-x-4 overflow-x-auto pb-3 sm:pb-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <div
                onClick={() => handleCategoryChange(category.id)}
                className={`font-serif font-bold transition-all duration-300 px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-xs sm:text-sm md:text-base text-black hover:scale-102 whitespace-nowrap flex flex-col items-center justify-center space-y-2 min-h-[140px] sm:min-h-[160px] md:min-h-[180px] cursor-pointer ${
                  activeCategory === category.id ? "scale-105" : ""
                }`}
              >
                {/* Image space */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg flex items-center justify-center mb-2 sm:mb-3 overflow-hidden">
                  {(() => {
                    const getImageForCategory = (categoryId: string) => {
                      const imageMap: Record<string, string> = {
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
                        "signature-mocktails": signatureMocktailsImg,
                        "soft-beverages": softBeveragesImg,
                      };
                      return imageMap[categoryId];
                    };

                    const imageSrc = getImageForCategory(category.id);
                    return imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={category.displayLabel}
                        className="w-full h-full object-contain rounded-md"
                        loading="lazy"
                        decoding="async"
                        style={{
                          imageRendering: "auto",
                          maxWidth: "100%",
                          height: "auto",
                          compress: "true",
                        }}
                        onLoad={(e) => {
                          // Compress image after load by creating smaller canvas version
                          const img = e.target as HTMLImageElement;
                          const canvas = document.createElement("canvas");
                          const ctx = canvas.getContext("2d");
                          if (ctx && img.naturalWidth > 200) {
                            // Only compress if image is larger than 200px
                            const ratio = Math.min(
                              200 / img.naturalWidth,
                              200 / img.naturalHeight,
                            );
                            canvas.width = img.naturalWidth * ratio;
                            canvas.height = img.naturalHeight * ratio;
                            ctx.imageSmoothingEnabled = true;
                            ctx.imageSmoothingQuality = "high";
                            ctx.drawImage(
                              img,
                              0,
                              0,
                              canvas.width,
                              canvas.height,
                            );
                            const compressedSrc = canvas.toDataURL(
                              "image/webp",
                              0.8,
                            );
                            img.src = compressedSrc;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-lg sm:text-xl md:text-2xl">
                        📷
                      </span>
                    );
                  })()}
                </div>
                {/* Category name */}
                <span
                  className="text-center leading-tight font-semibold"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {category.displayLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search Results Header */}
      {searchQuery.trim() && (
        <div className="container mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 elegant-shadow">
            <p
              className="font-serif text-sm sm:text-base md:text-lg"
              style={{ color: "var(--elegant-gold)" }}
            >
              Search results for "{searchQuery}" ({filteredItems.length} items
              found)
            </p>
          </div>
        </div>
      )}

      {/* Dishes Grid - Responsive grid with proper alignment */}
      {/* Dishes Grid - Responsive grid with proper alignment */}
      {/* Dishes Grid - Responsive grid with proper alignment */}
      <div className="container mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
        {isLoading ? (
          <div className="text-center py-12 sm:py-20">
            <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mb-6 sm:mb-8">
              <DotLottieReact
                src="https://lottie.host/a5b9e907-1da9-47f7-8134-ead1956cb8c2/xMA2QBGkvC.lottie"
                loop
                autoplay
                className="w-full h-full"
              />
            </div>
            <p
              className="text-lg sm:text-xl md:text-2xl"
              style={{
                color: "var(--elegant-gray)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Loading Cuisine
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 max-w-sm sm:max-w-md mx-auto elegant-shadow">
              <p
                className="font-serif text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4"
                style={{ color: "var(--elegant-gold)" }}
              >
                {searchQuery.trim()
                  ? "No dishes found for your search"
                  : "No Royal Dishes Found"}
              </p>
              <p
                className="font-sans text-sm sm:text-base md:text-lg"
                style={{ color: "var(--elegant-gray)" }}
              >
                {searchQuery.trim()
                  ? "Try searching with different keywords"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            style={{
              alignItems: "stretch", // This stretches all cards to equal height
            }}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id.toString()}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full" // Ensures each grid item takes full height
              >
                <DishCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
}
