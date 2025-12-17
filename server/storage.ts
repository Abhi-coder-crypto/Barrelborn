// import { MongoClient, Db, Collection, ObjectId } from "mongodb";
// import { type User, type InsertUser, type MenuItem, type InsertMenuItem, type CartItem, type InsertCartItem } from "@shared/schema";

// export interface IStorage {
//   getUser(id: string): Promise<User | undefined>;
//   getUserByUsername(username: string): Promise<User | undefined>;
//   createUser(user: InsertUser): Promise<User>;

//   getMenuItems(): Promise<MenuItem[]>;
//   getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
//   getMenuItem(id: string): Promise<MenuItem | undefined>;
//   getCategories(): string[];
//   addMenuItem(item: InsertMenuItem): Promise<MenuItem>;

//   getCartItems(): Promise<CartItem[]>;
//   addToCart(item: InsertCartItem): Promise<CartItem>;
//   removeFromCart(id: string): Promise<void>;
//   clearCart(): Promise<void>;
// }

// export class MongoStorage implements IStorage {
//   private client: MongoClient;
//   private db: Db;
//   private categoryCollections: Map<string, Collection<MenuItem>>;
//   private cartItemsCollection: Collection<CartItem>;
//   private usersCollection: Collection<User>;
//   private restaurantId: ObjectId;

//   // Define available categories - these match menu.tsx categories
//   private readonly categories = [
//     "soups",
//     "vegstarter",
//     "chickenstarter",
//     "prawnsstarter",
//     "seafood",
//     "springrolls",
//     "momos",
//     "gravies",
//     "potrice",
//     "rice",
//     "ricewithgravy",
//     "noodle",
//     "noodlewithgravy",
//     "thai",
//     "chopsuey",
//     "desserts",
//     "beverages",
//     "extra"
//   ];



//   constructor(connectionString: string) {
//     this.client = new MongoClient(connectionString);
//     this.db = this.client.db("barrelborn");
//     this.categoryCollections = new Map();

//     // Initialize collections for each category with correct collection names
//     const categoryCollectionMapping = {
//       "soups": "soups",
//       "vegstarter": "vegstarter",
//       "chickenstarter": "chickenstarter",
//       "prawnsstarter": "prawnsstarter",
//       "seafood": "seafood",
//       "springrolls": "springrolls",
//       "momos": "momos",
//       "gravies": "gravies",
//       "potrice": "potrice",
//       "rice": "rice",
//       "ricewithgravy": "ricewithgravy",
//       "noodle": "noodle",
//       "noodlewithgravy": "noodlewithgravy",
//       "thai": "thai",
//       "chopsuey": "chopsuey",
//       "desserts": "desserts",
//       "beverages": "beverages",
//       "extra": "extra"
//     };


//     this.categories.forEach(category => {
//       const collectionName = categoryCollectionMapping[category as keyof typeof categoryCollectionMapping];
//       this.categoryCollections.set(category, this.db.collection(collectionName));
//     });

//     this.cartItemsCollection = this.db.collection("cartitems");
//     this.usersCollection = this.db.collection("users");
//     this.restaurantId = new ObjectId("6874cff2a880250859286de6");
//   }

//   async connect() {
//     await this.client.connect();
//     await this.ensureCollectionsExist();
//   }

//   private async ensureCollectionsExist() {
//     try {
//       // Get list of existing collections
//       const existingCollections = await this.db.listCollections().toArray();
//       const existingNames = existingCollections.map(c => c.name);

//       // Create collections for categories that don't exist
//       for (const [category, collection] of this.categoryCollections) {
//         const collectionName = collection.collectionName;
//         if (!existingNames.includes(collectionName)) {
//           await this.db.createCollection(collectionName);
//           console.log(`Created collection: ${collectionName} for category: ${category}`);
//         }
//       }
//     } catch (error) {
//       console.error("Error ensuring collections exist:", error);
//     }
//   }

//   async getUser(id: string): Promise<User | undefined> {
//     try {
//       const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
//       return user || undefined;
//     } catch (error) {
//       console.error("Error getting user:", error);
//       return undefined;
//     }
//   }

//   async getUserByUsername(username: string): Promise<User | undefined> {
//     try {
//       const user = await this.usersCollection.findOne({ username });
//       return user || undefined;
//     } catch (error) {
//       console.error("Error getting user by username:", error);
//       return undefined;
//     }
//   }

//   async createUser(insertUser: InsertUser): Promise<User> {
//     try {
//       const now = new Date();
//       const user: Omit<User, '_id'> = {
//         ...insertUser,
//         createdAt: now,
//         updatedAt: now,
//       };

//       const result = await this.usersCollection.insertOne(user as User);
//       return {
//         _id: result.insertedId,
//         ...user,
//       } as User;
//     } catch (error) {
//       console.error("Error creating user:", error);
//       throw error;
//     }
//   }

//   async getMenuItems(): Promise<MenuItem[]> {
//     try {
//       const allMenuItems: MenuItem[] = [];

//       // Get items from all category collections
//       for (const [category, collection] of this.categoryCollections) {
//         const items = await collection.find({}).toArray();
//         allMenuItems.push(...items);
//       }

//       // Apply custom sorting: Veg items first, then Chicken, then Prawns, then others
//       return this.sortMenuItems(allMenuItems);
//     } catch (error) {
//       console.error("Error getting menu items:", error);
//       return [];
//     }
//   }

//   async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
//     try {
//       const collection = this.categoryCollections.get(category);
//       if (!collection) {
//         console.error(`Category "${category}" not found`);
//         return [];
//       }

//       const menuItems = await collection.find({}).toArray();
//       // Apply custom sorting: Veg items first, then Chicken, then Prawns, then others
//       return this.sortMenuItems(menuItems);
//     } catch (error) {
//       console.error("Error getting menu items by category:", error);
//       return [];
//     }
//   }

//   async getMenuItem(id: string): Promise<MenuItem | undefined> {
//     try {
//       // Search across all category collections
//       for (const [category, collection] of this.categoryCollections) {
//         const menuItem = await collection.findOne({ _id: new ObjectId(id) });
//         if (menuItem) {
//           return menuItem;
//         }
//       }
//       return undefined;
//     } catch (error) {
//       console.error("Error getting menu item:", error);
//       return undefined;
//     }
//   }

//   getCategories(): string[] {
//     return [...this.categories];
//   }

//   async addMenuItem(item: InsertMenuItem): Promise<MenuItem> {
//     try {
//       const collection = this.categoryCollections.get(item.category);
//       if (!collection) {
//         throw new Error(`Category "${item.category}" not found`);
//       }

//       const now = new Date();
//       const menuItem: Omit<MenuItem, '_id'> = {
//         ...item,
//         restaurantId: this.restaurantId,
//         createdAt: now,
//         updatedAt: now,
//         __v: 0
//       };

//       const result = await collection.insertOne(menuItem as MenuItem);
//       return {
//         _id: result.insertedId,
//         ...menuItem,
//       } as MenuItem;
//     } catch (error) {
//       console.error("Error adding menu item:", error);
//       throw error;
//     }
//   }

//   async getCartItems(): Promise<CartItem[]> {
//     try {
//       const cartItems = await this.cartItemsCollection.find({}).toArray();
//       return cartItems;
//     } catch (error) {
//       console.error("Error getting cart items:", error);
//       return [];
//     }
//   }

//   async addToCart(item: InsertCartItem): Promise<CartItem> {
//     try {
//       const menuItemObjectId = new ObjectId(item.menuItemId);
//       const existing = await this.cartItemsCollection.findOne({ menuItemId: menuItemObjectId });

//       if (existing) {
//         const updatedCart = await this.cartItemsCollection.findOneAndUpdate(
//           { _id: existing._id },
//           {
//             $inc: { quantity: item.quantity || 1 },
//             $set: { updatedAt: new Date() }
//           },
//           { returnDocument: 'after' }
//         );
//         return updatedCart!;
//       }

//       const now = new Date();
//       const cartItem: Omit<CartItem, '_id'> = {
//         menuItemId: menuItemObjectId,
//         quantity: item.quantity || 1,
//         createdAt: now,
//         updatedAt: now,
//       };

//       const result = await this.cartItemsCollection.insertOne(cartItem as CartItem);
//       return {
//         _id: result.insertedId,
//         ...cartItem,
//       } as CartItem;
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       throw error;
//     }
//   }

//   async removeFromCart(id: string): Promise<void> {
//     try {
//       await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//       throw error;
//     }
//   }

//   async clearCart(): Promise<void> {
//     try {
//       await this.cartItemsCollection.deleteMany({});
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       throw error;
//     }
//   }

//   private sortMenuItems(items: MenuItem[]): MenuItem[] {
//     return items.sort((a, b) => {
//       const aName = a.name.toLowerCase();
//       const bName = b.name.toLowerCase();
      
//       // First priority: Veg items before non-veg items
//       if (a.isVeg !== b.isVeg) {
//         return a.isVeg ? -1 : 1; // Veg items first
//       }
      
//       // Second priority: Within same veg/non-veg category, sort by name type
//       const getSortOrder = (name: string): number => {
//         if (name.startsWith('veg')) return 1;
//         if (name.startsWith('chicken')) return 2;
//         if (name.startsWith('prawns') || name.startsWith('prawn')) return 3;
//         return 4;
//       };
      
//       const aOrder = getSortOrder(aName);
//       const bOrder = getSortOrder(bName);
      
//       // If same sort order, sort alphabetically
//       if (aOrder === bOrder) {
//         return aName.localeCompare(bName);
//       }
      
//       return aOrder - bOrder;
//     });
//   }
// }

// const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
// export const storage = new MongoStorage(connectionString);
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { type User, type InsertUser, type MenuItem, type InsertMenuItem, type CartItem, type InsertCartItem } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  getCategories(): string[];
  addMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  getCartItems(): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(): Promise<void>;
  
  clearDatabase(): Promise<void>;
  fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private categoryCollections: Map<string, Collection<MenuItem>>;
  private cartItemsCollection: Collection<CartItem>;
  private usersCollection: Collection<User>;
  private restaurantId: ObjectId;

  // Define available categories
  private readonly categories = [
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



  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db("barrelborn");
    this.categoryCollections = new Map();

    // Initialize collections for each category with correct collection names
    const categoryCollectionMapping: Record<string, string> = {};
    this.categories.forEach(cat => {
      categoryCollectionMapping[cat] = cat;
    });


    this.categories.forEach(category => {
      const collectionName = categoryCollectionMapping[category as keyof typeof categoryCollectionMapping];
      this.categoryCollections.set(category, this.db.collection(collectionName));
    });

    this.cartItemsCollection = this.db.collection("cartitems");
    this.usersCollection = this.db.collection("users");
    this.restaurantId = new ObjectId("6874cff2a880250859286de6");
  }

  async connect() {
    await this.client.connect();
    await this.ensureCollectionsExist();
  }

  private async ensureCollectionsExist() {
    try {
      // Get list of existing collections
      const existingCollections = await this.db.listCollections().toArray();
      const existingNames = existingCollections.map(c => c.name);

      // Create collections for categories that don't exist
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

  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
      return user || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await this.usersCollection.findOne({ username });
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const now = new Date();
      const user: Omit<User, '_id'> = {
        ...insertUser,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.usersCollection.insertOne(user as User);
      return {
        _id: result.insertedId,
        ...user,
      } as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const allMenuItems: MenuItem[] = [];
      const collectionStats: { category: string; count: number; items: string[] }[] = [];

      // Get items from all category collections
      for (const [category, collection] of this.categoryCollections) {
        const items = await collection.find({}).toArray();
        const itemNames = items.map((item: any) => item.name || 'NO NAME');
        console.log(`[MongoDB] Collection "${category}": ${items.length} items`);
        if (items.length > 0) {
          console.log(`  Items: ${itemNames.slice(0, 3).join(', ')}${items.length > 3 ? '...' : ''}`);
          console.log(`  Sample item: ${JSON.stringify(items[0]).substring(0, 200)}`);
        }
        collectionStats.push({ category, count: items.length, items: itemNames });
        allMenuItems.push(...items);
      }

      console.log(`[MongoDB] TOTAL: ${allMenuItems.length} items across ${this.categoryCollections.size} collections`);
      console.log('[MongoDB] Collections summary:', collectionStats);

      // Apply custom sorting: Veg items first, then Chicken, then Prawns, then others
      return this.sortMenuItems(allMenuItems);
    } catch (error) {
      console.error("Error getting menu items:", error);
      return [];
    }
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const collection = this.categoryCollections.get(category);
      if (!collection) {
        console.error(`Category "${category}" not found`);
        return [];
      }

      const menuItems = await collection.find({}).toArray();
      // Apply custom sorting: Veg items first, then Chicken, then Prawns, then others
      return this.sortMenuItems(menuItems);
    } catch (error) {
      console.error("Error getting menu items by category:", error);
      return [];
    }
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    try {
      // Search across all category collections
      for (const [category, collection] of this.categoryCollections) {
        const menuItem = await collection.findOne({ _id: new ObjectId(id) });
        if (menuItem) {
          return menuItem;
        }
      }
      return undefined;
    } catch (error) {
      console.error("Error getting menu item:", error);
      return undefined;
    }
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  async addMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    try {
      const collection = this.categoryCollections.get(item.category);
      if (!collection) {
        throw new Error(`Category "${item.category}" not found`);
      }

      const now = new Date();
      const menuItem: Omit<MenuItem, '_id'> = {
        ...item,
        restaurantId: this.restaurantId,
        createdAt: now,
        updatedAt: now,
        __v: 0
      };

      const result = await collection.insertOne(menuItem as MenuItem);
      return {
        _id: result.insertedId,
        ...menuItem,
      } as MenuItem;
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }

  async getCartItems(): Promise<CartItem[]> {
    try {
      const cartItems = await this.cartItemsCollection.find({}).toArray();
      return cartItems;
    } catch (error) {
      console.error("Error getting cart items:", error);
      return [];
    }
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    try {
      const menuItemObjectId = new ObjectId(item.menuItemId);
      const existing = await this.cartItemsCollection.findOne({ menuItemId: menuItemObjectId });

      if (existing) {
        const updatedCart = await this.cartItemsCollection.findOneAndUpdate(
          { _id: existing._id },
          {
            $inc: { quantity: item.quantity || 1 },
            $set: { updatedAt: new Date() }
          },
          { returnDocument: 'after' }
        );
        return updatedCart!;
      }

      const now = new Date();
      const cartItem: Omit<CartItem, '_id'> = {
        menuItemId: menuItemObjectId,
        quantity: item.quantity || 1,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.cartItemsCollection.insertOne(cartItem as CartItem);
      return {
        _id: result.insertedId,
        ...cartItem,
      } as CartItem;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async removeFromCart(id: string): Promise<void> {
    try {
      await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      await this.cartItemsCollection.deleteMany({});
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      // Get all existing collections
      const existingCollections = await this.db.listCollections().toArray();
      
      // Drop all collections except system collections
      for (const collection of existingCollections) {
        const name = collection.name;
        // Skip system collections
        if (name.startsWith('system.')) continue;
        // Drop the collection
        await this.db.dropCollection(name);
        console.log(`Dropped collection: ${name}`);
      }
      
      // Recreate collections for new categories
      await this.ensureCollectionsExist();
      console.log("Database cleared and fresh collections created");
    } catch (error) {
      console.error("Error clearing database:", error);
      throw error;
    }
  }

  async fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }> {
    try {
      const details: string[] = [];
      let totalUpdated = 0;

      // Non-veg keywords - items containing these should be isVeg: false
      const nonVegKeywords = [
        'chicken', 'prawns', 'prawn', 'mutton', 'lamb', 'fish', 'seafood',
        'pork', 'meat', 'keema', 'kheema', 'tandoori chicken', 'egg',
        'butter chicken', 'kadai chicken', 'murgh', 'gosht', 'jhinga',
        'lobster', 'crab', 'squid', 'octopus', 'salmon', 'tuna',
        'bacon', 'ham', 'sausage', 'pepperoni', 'salami', 'duck', 'turkey',
        'quail', 'venison', 'rabbit', 'oyster', 'clam', 'shrimp', 'anchovies'
      ];

      // Items that should always be VEG despite containing non-veg keywords
      const vegExceptions = [
        'beefeater',      // Gin brand name
        'chameleon',      // Contains 'ham' but is a mocktail
        'ranthambore',    // Contains 'ham' but is a mocktail  
        'veggie',         // Explicitly vegetarian
        'veg ',           // Items starting with Veg
        'paneer',         // Cottage cheese - always veg
        'cottage cheese', // Always veg
        'tofu',           // Always veg
        'mushroom',       // Always veg
        'vegetable',      // Always veg
        'dal ',           // Lentils - always veg
        'aloo',           // Potato - always veg
        'gobi',           // Cauliflower - always veg
        'palak',          // Spinach - always veg
        'chana',          // Chickpeas - always veg
        'rajma'           // Kidney beans - always veg
      ];

      // Items that should always be NON-VEG
      const nonVegExact = [
        'kheema mutter',
        'keema mutter',
        'bombay irani kheema'
      ];

      // Iterate through all category collections
      for (const [category, collection] of this.categoryCollections) {
        const items = await collection.find({}).toArray();
        
        for (const item of items) {
          const nameLower = item.name.toLowerCase();
          
          // Check if item is an exception that should be veg
          const isVegException = vegExceptions.some(exc => nameLower.includes(exc));
          
          // Check if item matches exact non-veg patterns
          const isExactNonVeg = nonVegExact.some(exact => nameLower.includes(exact));
          
          // Check if item name contains any non-veg keyword
          const containsNonVegKeyword = nonVegKeywords.some(keyword => nameLower.includes(keyword));
          
          // Determine if item should be non-veg
          let shouldBeNonVeg = false;
          
          if (isExactNonVeg) {
            shouldBeNonVeg = true;
          } else if (isVegException) {
            shouldBeNonVeg = false;
          } else if (containsNonVegKeyword) {
            shouldBeNonVeg = true;
          }
          
          // If item should be non-veg but is marked as veg, update it
          if (shouldBeNonVeg && item.isVeg === true) {
            await collection.updateOne(
              { _id: item._id },
              { $set: { isVeg: false } }
            );
            details.push(`Fixed: "${item.name}" changed from veg to non-veg`);
            totalUpdated++;
          }
          // If item should be veg but is marked as non-veg, update it
          else if (!shouldBeNonVeg && item.isVeg === false) {
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

  private sortMenuItems(items: MenuItem[]): MenuItem[] {
    return items.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // First priority: Veg items before non-veg items
      if (a.isVeg !== b.isVeg) {
        return a.isVeg ? -1 : 1; // Veg items first
      }
      
      // Second priority: Within same veg/non-veg category, sort by name type
      const getSortOrder = (name: string): number => {
        if (name.startsWith('veg')) return 1;
        if (name.startsWith('chicken')) return 2;
        if (name.startsWith('prawns') || name.startsWith('prawn')) return 3;
        return 4;
      };
      
      const aOrder = getSortOrder(aName);
      const bOrder = getSortOrder(bName);
      
      // If same sort order, sort alphabetically
      if (aOrder === bOrder) {
        return aName.localeCompare(bName);
      }
      
      return aOrder - bOrder;
    });
  }
}

const connectionString = process.env.MONGODB_URI;
if (!connectionString) {
  throw new Error("MONGODB_URI environment variable is required");
}
export const storage = new MongoStorage(connectionString);
