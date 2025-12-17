// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { MongoClient, ObjectId } from "mongodb";
var MongoStorage = class {
  client;
  db;
  categoryCollections;
  cartItemsCollection;
  usersCollection;
  restaurantId;
  // Define available categories
  categories = [
    "nibbles",
    "titbits",
    "soups",
    "salads",
    "starters",
    "charcoal",
    "pasta",
    "pizza",
    "sliders",
    "entree",
    "bao-dimsum",
    "curries",
    "biryani",
    "rice",
    "dals",
    "breads",
    "asian-mains",
    "thai-bowls",
    "rice-noodles",
    "sizzlers",
    "blended-whisky",
    "blended-scotch-whisky",
    "american-irish-whiskey",
    "single-malt-whisky",
    "vodka",
    "gin",
    "rum",
    "tequila",
    "cognac-brandy",
    "liqueurs",
    "sparkling-wine",
    "white-wines",
    "rose-wines",
    "red-wines",
    "dessert-wines",
    "port-wine",
    "signature-mocktails",
    "soft-beverages"
  ];
  constructor(connectionString2) {
    this.client = new MongoClient(connectionString2);
    this.db = this.client.db("barrelborn");
    this.categoryCollections = /* @__PURE__ */ new Map();
    const categoryCollectionMapping = {
      "nibbles": "nibbles",
      "titbits": "titbits",
      "soups": "soups",
      "salads": "salads",
      "starters": "starters",
      "charcoal": "charcoal",
      "pasta": "pasta",
      "pizza": "pizza",
      "sliders": "sliders",
      "entree": "entree",
      "bao-dimsum": "bao-dimsum",
      "curries": "curries",
      "biryani": "biryani",
      "rice": "rice",
      "dals": "dals",
      "breads": "breads",
      "asian-mains": "asian-mains",
      "thai-bowls": "thai-bowls",
      "rice-noodles": "rice-noodles",
      "sizzlers": "sizzlers",
      "blended-whisky": "blended-whisky",
      "blended-scotch-whisky": "blended-scotch-whisky",
      "american-irish-whiskey": "american-irish-whiskey",
      "single-malt-whisky": "single-malt-whisky",
      "vodka": "vodka",
      "gin": "gin",
      "rum": "rum",
      "tequila": "tequila",
      "cognac-brandy": "cognac-brandy",
      "liqueurs": "liqueurs",
      "sparkling-wine": "sparkling-wine",
      "white-wines": "white-wines",
      "rose-wines": "rose-wines",
      "red-wines": "red-wines",
      "dessert-wines": "dessert-wines",
      "port-wine": "port-wine",
      "signature-mocktails": "signature-mocktails",
      "soft-beverages": "soft-beverages"
    };
    this.categories.forEach((category) => {
      const collectionName = categoryCollectionMapping[category];
      if (collectionName) {
        this.categoryCollections.set(category, this.db.collection(collectionName));
      }
    });
    this.cartItemsCollection = this.db.collection("cartitems");
    this.usersCollection = this.db.collection("users");
    this.restaurantId = new ObjectId("6874cff2a880250859286de6");
  }
  async connect() {
    await this.client.connect();
    await this.listAllCollections();
    await this.ensureCollectionsExist();
  }
  async listAllCollections() {
    try {
      const existingCollections = await this.db.listCollections().toArray();
      const existingNames = existingCollections.map((c) => c.name);
      console.log("[MongoDB] All existing collections:", existingNames);
      for (const collName of existingNames) {
        if (!collName.startsWith("system.")) {
          const collection = this.db.collection(collName);
          const count = await collection.countDocuments();
          console.log(`[MongoDB] Collection "${collName}": ${count} documents`);
        }
      }
    } catch (error) {
      console.error("[MongoDB] Error listing collections:", error);
    }
  }
  async ensureCollectionsExist() {
    try {
      const existingCollections = await this.db.listCollections().toArray();
      const existingNames = existingCollections.map((c) => c.name);
      for (const [category, collection] of this.categoryCollections) {
        const collectionName = collection.collectionName;
        if (!existingNames.includes(collectionName)) {
          await this.db.createCollection(collectionName);
          console.log(`Created collection: ${collectionName} for category: ${category}`);
        }
      }
    } catch (error) {
      console.error("Error ensuring collections exist:", error);
    }
  }
  async getUser(id) {
    try {
      const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
      return user || void 0;
    } catch (error) {
      console.error("Error getting user:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const user = await this.usersCollection.findOne({ username });
      return user || void 0;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    try {
      const now = /* @__PURE__ */ new Date();
      const user = {
        ...insertUser,
        createdAt: now,
        updatedAt: now
      };
      const result = await this.usersCollection.insertOne(user);
      return {
        _id: result.insertedId,
        ...user
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async getMenuItems() {
    try {
      const allMenuItems = [];
      const collectionStats = [];
      for (const [category, collection] of this.categoryCollections) {
        const items = await collection.find({}).toArray();
        const itemNames = items.map((item) => item.name || "NO NAME");
        console.log(`[MongoDB] Collection "${category}": ${items.length} items`);
        if (items.length > 0) {
          console.log(`  Items: ${itemNames.slice(0, 3).join(", ")}${items.length > 3 ? "..." : ""}`);
          console.log(`  Sample item: ${JSON.stringify(items[0]).substring(0, 200)}`);
        }
        collectionStats.push({ category, count: items.length, items: itemNames });
        allMenuItems.push(...items);
      }
      console.log(`[MongoDB] TOTAL: ${allMenuItems.length} items across ${this.categoryCollections.size} collections`);
      console.log("[MongoDB] Collections summary:", collectionStats);
      return this.sortMenuItems(allMenuItems);
    } catch (error) {
      console.error("Error getting menu items:", error);
      return [];
    }
  }
  async getMenuItemsByCategory(category) {
    try {
      const collection = this.categoryCollections.get(category);
      if (!collection) {
        console.error(`Category "${category}" not found`);
        return [];
      }
      const menuItems = await collection.find({}).toArray();
      return this.sortMenuItems(menuItems);
    } catch (error) {
      console.error("Error getting menu items by category:", error);
      return [];
    }
  }
  async getMenuItem(id) {
    try {
      for (const [category, collection] of this.categoryCollections) {
        const menuItem = await collection.findOne({ _id: new ObjectId(id) });
        if (menuItem) {
          return menuItem;
        }
      }
      return void 0;
    } catch (error) {
      console.error("Error getting menu item:", error);
      return void 0;
    }
  }
  getCategories() {
    return [...this.categories];
  }
  async addMenuItem(item) {
    try {
      const collection = this.categoryCollections.get(item.category);
      if (!collection) {
        throw new Error(`Category "${item.category}" not found`);
      }
      const now = /* @__PURE__ */ new Date();
      const menuItem = {
        ...item,
        restaurantId: this.restaurantId,
        createdAt: now,
        updatedAt: now,
        __v: 0
      };
      const result = await collection.insertOne(menuItem);
      return {
        _id: result.insertedId,
        ...menuItem
      };
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }
  async getCartItems() {
    try {
      const cartItems = await this.cartItemsCollection.find({}).toArray();
      return cartItems;
    } catch (error) {
      console.error("Error getting cart items:", error);
      return [];
    }
  }
  async addToCart(item) {
    try {
      const menuItemObjectId = new ObjectId(item.menuItemId);
      const existing = await this.cartItemsCollection.findOne({ menuItemId: menuItemObjectId });
      if (existing) {
        const updatedCart = await this.cartItemsCollection.findOneAndUpdate(
          { _id: existing._id },
          {
            $inc: { quantity: item.quantity || 1 },
            $set: { updatedAt: /* @__PURE__ */ new Date() }
          },
          { returnDocument: "after" }
        );
        return updatedCart;
      }
      const now = /* @__PURE__ */ new Date();
      const cartItem = {
        menuItemId: menuItemObjectId,
        quantity: item.quantity || 1,
        createdAt: now,
        updatedAt: now
      };
      const result = await this.cartItemsCollection.insertOne(cartItem);
      return {
        _id: result.insertedId,
        ...cartItem
      };
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }
  async removeFromCart(id) {
    try {
      await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }
  async clearCart() {
    try {
      await this.cartItemsCollection.deleteMany({});
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }
  async clearDatabase() {
    try {
      const existingCollections = await this.db.listCollections().toArray();
      for (const collection of existingCollections) {
        const name = collection.name;
        if (name.startsWith("system.")) continue;
        await this.db.dropCollection(name);
        console.log(`Dropped collection: ${name}`);
      }
      await this.ensureCollectionsExist();
      console.log("Database cleared and fresh collections created");
    } catch (error) {
      console.error("Error clearing database:", error);
      throw error;
    }
  }
  async fixVegNonVegClassification() {
    try {
      const details = [];
      let totalUpdated = 0;
      const nonVegKeywords = [
        "chicken",
        "prawns",
        "prawn",
        "mutton",
        "lamb",
        "fish",
        "seafood",
        "pork",
        "meat",
        "keema",
        "kheema",
        "tandoori chicken",
        "egg",
        "butter chicken",
        "kadai chicken",
        "murgh",
        "gosht",
        "jhinga",
        "lobster",
        "crab",
        "squid",
        "octopus",
        "salmon",
        "tuna",
        "bacon",
        "ham",
        "sausage",
        "pepperoni",
        "salami",
        "duck",
        "turkey",
        "quail",
        "venison",
        "rabbit",
        "oyster",
        "clam",
        "shrimp",
        "anchovies"
      ];
      const vegExceptions = [
        "beefeater",
        // Gin brand name
        "chameleon",
        // Contains 'ham' but is a mocktail
        "ranthambore",
        // Contains 'ham' but is a mocktail  
        "veggie",
        // Explicitly vegetarian
        "veg ",
        // Items starting with Veg
        "paneer",
        // Cottage cheese - always veg
        "cottage cheese",
        // Always veg
        "tofu",
        // Always veg
        "mushroom",
        // Always veg
        "vegetable",
        // Always veg
        "dal ",
        // Lentils - always veg
        "aloo",
        // Potato - always veg
        "gobi",
        // Cauliflower - always veg
        "palak",
        // Spinach - always veg
        "chana",
        // Chickpeas - always veg
        "rajma"
        // Kidney beans - always veg
      ];
      const nonVegExact = [
        "kheema mutter",
        "keema mutter",
        "bombay irani kheema"
      ];
      for (const [category, collection] of this.categoryCollections) {
        const items = await collection.find({}).toArray();
        for (const item of items) {
          const nameLower = item.name.toLowerCase();
          const isVegException = vegExceptions.some((exc) => nameLower.includes(exc));
          const isExactNonVeg = nonVegExact.some((exact) => nameLower.includes(exact));
          const containsNonVegKeyword = nonVegKeywords.some((keyword) => nameLower.includes(keyword));
          let shouldBeNonVeg = false;
          if (isExactNonVeg) {
            shouldBeNonVeg = true;
          } else if (isVegException) {
            shouldBeNonVeg = false;
          } else if (containsNonVegKeyword) {
            shouldBeNonVeg = true;
          }
          if (shouldBeNonVeg && item.isVeg === true) {
            await collection.updateOne(
              { _id: item._id },
              { $set: { isVeg: false } }
            );
            details.push(`Fixed: "${item.name}" changed from veg to non-veg`);
            totalUpdated++;
          } else if (!shouldBeNonVeg && item.isVeg === false) {
            await collection.updateOne(
              { _id: item._id },
              { $set: { isVeg: true } }
            );
            details.push(`Fixed: "${item.name}" changed from non-veg to veg`);
            totalUpdated++;
          }
        }
      }
      console.log(`Fixed ${totalUpdated} items' veg/non-veg classification`);
      return { updated: totalUpdated, details };
    } catch (error) {
      console.error("Error fixing veg/non-veg classification:", error);
      throw error;
    }
  }
  sortMenuItems(items) {
    return items.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (a.isVeg !== b.isVeg) {
        return a.isVeg ? -1 : 1;
      }
      const getSortOrder = (name) => {
        if (name.startsWith("veg")) return 1;
        if (name.startsWith("chicken")) return 2;
        if (name.startsWith("prawns") || name.startsWith("prawn")) return 3;
        return 4;
      };
      const aOrder = getSortOrder(aName);
      const bOrder = getSortOrder(bName);
      if (aOrder === bOrder) {
        return aName.localeCompare(bName);
      }
      return aOrder - bOrder;
    });
  }
};
var connectionString = process.env.MONGODB_URI;
if (!connectionString) {
  throw new Error("MONGODB_URI environment variable is required");
}
var storage = new MongoStorage(connectionString);

// shared/schema.ts
import { z } from "zod";
var insertMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.number().positive(), z.string().min(1)]),
  // Support both number and string prices
  category: z.string().min(1),
  isVeg: z.boolean(),
  image: z.string().url(),
  restaurantId: z.string().optional(),
  isAvailable: z.boolean().default(true)
});
var insertCartItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().positive().default(1)
});
var insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/menu-items", async (req, res) => {
    try {
      const categoryQuery = req.query.category || req.params.category;
      if (categoryQuery) {
        const items2 = await storage.getMenuItemsByCategory(categoryQuery);
        return res.json(items2);
      }
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });
  app2.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    try {
      const items = await storage.getCartItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });
  app2.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  app2.delete("/api/cart", async (req, res) => {
    try {
      await storage.clearCart();
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/fix-veg-classification", async (req, res) => {
    try {
      const result = await storage.fixVegNonVegClassification();
      res.json({
        message: `Fixed ${result.updated} items`,
        updated: result.updated,
        details: result.details
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fix veg classification" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await storage.connect();
  log("Connected to MongoDB");
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
