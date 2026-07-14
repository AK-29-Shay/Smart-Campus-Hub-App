import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "./types";
import { auth, db } from "./lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  login: (role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  updateUserRoleInDb: (role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("hub_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("hub_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    // Listen to real firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "Google Operator",
              role: (data.role as UserRole) || "USER",
              createdAt: data.createdAt || new Date().toISOString(),
            });
          } else {
            // New Google User - create profile with default role "USER"
            const newUser: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "Google Operator",
              role: "USER",
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, {
              email: newUser.email,
              displayName: newUser.displayName,
              role: newUser.role,
              createdAt: newUser.createdAt,
            });
            setUser(newUser);
          }
        } catch (error) {
          console.error("Error reading/writing user doc in Firestore:", error);
          // Fallback to local profile
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "Google Operator",
            role: "USER",
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Fallback or guest
        const savedUser = localStorage.getItem("hub_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (role: UserRole) => {
    // Standard mock user login for quickfill nodes
    const mockUser: UserProfile = {
      id: `u-${role.toLowerCase()}`,
      email: `${role.toLowerCase()}@campus.hub`,
      displayName: `${role.charAt(0) + role.slice(1).toLowerCase()} Operator`,
      role: role,
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem("hub_user", JSON.stringify(mockUser));
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const updateUserRoleInDb = async (newRole: UserRole) => {
    if (!user) return;
    
    // Update local state first
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);

    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, { role: newRole });
      } catch (err) {
        console.error("Failed to update user role in Firestore:", err);
      }
    } else {
      localStorage.setItem("hub_user", JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem("hub_user");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role: user?.role || null, 
        login, 
        loginWithGoogle, 
        updateUserRoleInDb, 
        logout, 
        isLoading,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
