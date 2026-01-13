import { db, User } from "./db";
import { hashPassword, verifyPassword, generateToken, decodeToken, generateId, getTimestamp, delay } from "./helpers";
import { initializeDatabase } from "./seed";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    householdId?: string;
  };
  token: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    await delay(200);

    // Initialize database on first use
    await initializeDatabase();

    // Normalize email to lowercase for case-insensitive matching
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if user already exists (case-insensitive)
    // Try to find by email index first, then fallback to full scan
    let existingUser = null;
    try {
      // Try to find by exact email match (faster with index)
      existingUser = await db.users.where("email").equals(normalizedEmail).first();
    } catch (e) {
      // Fallback to full scan if index query fails
      const allUsers = await db.users.toArray();
      existingUser = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    }
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const now = getTimestamp();
    const user: User = {
      id: generateId(),
      email: normalizedEmail, // Store normalized email
      name: data.name.trim(),
      passwordHash: hashPassword(data.password),
      householdId: generateId(), // Create a new household for the user
      createdAt: now,
      updatedAt: now,
    };

    // Store user in database
    try {
      await db.users.add(user);
      console.log(`✅ User stored in database: ${user.email} (ID: ${user.id})`);
      
      // Verify user was stored correctly
      const storedUser = await db.users.get(user.id);
      if (!storedUser) {
        throw new Error("Failed to verify user storage in database");
      }
      console.log(`✅ User verified in database: ${storedUser.email}`);
    } catch (dbError) {
      console.error("❌ Database error during registration:", dbError);
      if (dbError instanceof Error && dbError.message.includes("ConstraintError")) {
        throw new Error("User with this email already exists");
      }
      throw new Error("Failed to create account. Please try again.");
    }

    // Seed demo data for the new user
    try {
      const { seedUserData } = await import("./seed");
      await seedUserData(user.id, user.householdId);
      console.log(`✅ Demo data seeded for user: ${user.email}`);
    } catch (seedError) {
      console.error("⚠️ Warning: Failed to seed demo data during registration:", seedError);
      // Don't fail registration if seeding fails - user can still login
    }

    const token = generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        householdId: user.householdId,
      },
      token,
    };
  } catch (error) {
    // Re-throw with better error message if it's a database error
    if (error instanceof Error) {
      if (error.message.includes("Database can only be accessed")) {
        throw new Error("Database initialization failed. Please refresh the page.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred during registration");
  }
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    await delay(250);

    // Initialize database on first use
    await initializeDatabase();

    // Normalize email to lowercase for case-insensitive matching
    const normalizedEmail = credentials.email.toLowerCase().trim();

    // Try to find user by email index first, then fallback to full scan
    let user = null;
    try {
      // Try to find by exact email match (faster with index)
      user = await db.users.where("email").equals(normalizedEmail).first();
    } catch (e) {
      // Fallback to full scan if index query fails
      const allUsers = await db.users.toArray();
      user = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      // Check if database has any users at all
      const userCount = await db.users.count();
      if (userCount === 0) {
        throw new Error("No account found. Please register first.");
      }
      throw new Error("Invalid email or password");
    }

    if (!verifyPassword(credentials.password, user.passwordHash)) {
      throw new Error("Invalid email or password");
    }

    console.log(`✅ User logged in successfully: ${user.email} (ID: ${user.id})`);

    // Ensure user has demo data (seed if missing)
    try {
      const { seedUserData } = await import("./seed");
      await seedUserData(user.id, user.householdId);
    } catch (seedError) {
      console.error("⚠️ Warning: Failed to seed demo data during login:", seedError);
      // Don't fail login if seeding fails - user can still access their account
    }

    const token = generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        householdId: user.householdId,
      },
      token,
    };
  } catch (error) {
    // Re-throw with better error message if it's a database error
    if (error instanceof Error) {
      if (error.message.includes("Database can only be accessed")) {
        throw new Error("Database initialization failed. Please refresh the page.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred during login");
  }
}

/**
 * Get current user from token
 */
export async function getCurrentUser(token: string): Promise<{
  id: string;
  name: string;
  email: string;
  householdId?: string;
} | null> {
  await delay(100);

  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  const user = await db.users.get(decoded.userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    householdId: user.householdId,
  };
}

/**
 * Verify token validity
 */
export function verifyToken(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) {
    return false;
  }

  // Token expires after 30 days
  const tokenAge = Date.now() - decoded.iat;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return tokenAge < thirtyDays;
}

