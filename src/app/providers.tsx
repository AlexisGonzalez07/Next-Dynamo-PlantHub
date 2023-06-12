"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import {
  readUser,
  writeUser,
  readLastLogged,
  writeLastLogged,
} from "../utils/idb";
import { usePathname } from "next/navigation";
interface ProvidersProps {
  children: ReactNode;
}

interface UserContextData {
  data: any;
  loading: boolean;
  error: any;
  updateUserData: (user: any) => void;
}

export const UserContext = createContext<UserContextData>({
  data: null,
  loading: false,
  error: null,
  updateUserData: () => {},
});

const IDBProvider = ({ children }: ProvidersProps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession(); // Access session information
  console.log(data);
  console.log(loading);
  console.log(error);
  console.log(session);
  console.log(status);
  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    const fetchData = async () => {
      console.log("THE FETCH DATA HOOK RUNNING BC SESSION AUTHORIZED");
      setLoading(true);
      setError(null);
      try {
        const userInfo = await readUser(session?.user?.email);
        // This means it's the user's first time.
        if (!userInfo?.firstName) {
          const response = await fetch(
            `/api/user?email=${session?.user?.email}`
          );
          const newUser = await response.json();
          return updateUserData(newUser);
        }
        setData(userInfo);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (status === "authenticated" || data !== null) {
      return;
    }
    const tryLastLoggedIn = async () => {
      console.log(
        "THE TRY LAST LOGGIN RAN BC LOADING ALLTHOUGH LOADING IS CURRENTLY TRUE, SESSION IS NULL, OR DATA IS NULL"
      );
      //This should be await read last logged in token for still available?
      const userInfo = await readLastLogged();
      if (!userInfo) {
        setError("Offline or Unauthenticated");
        setLoading(false);
        return;
      }
      //if there's a user, we can get these user credentials and their expiration date.
      function isTokenValid(dateString) {
        const currentDate = new Date();
        const targetDate = new Date(dateString);
        return currentDate.getTime() < targetDate.getTime();
      }
      const targetDate = "2023-07-10T06:43:46.029Z";
      // attempt to validate the user
      const validToken = isTokenValid(targetDate);
      if (!validToken) {
        setError("Offline or Unauthenticated");
        setLoading(false);
        return;
      }
      const userInPrimary = await readUser(userInfo.email);
      return updateUserData(userInPrimary);
    };
    tryLastLoggedIn();
  }, [loading, session]);

  const updateUserData = async (user) => {
    console.log("THE UPDATE USER DATA RUNNING");
    try {
      setLoading(true);
      setError(null);
      await writeUser(user);
      if (session) {
        const lastUserDetails = {
          expires: session.expires,
          email: session.user.email,
        };
        await writeLastLogged(lastUserDetails);
      }
      setData(user);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Render the IDBContext.Provider with the updated global state and updateuserData function
  return (
    <UserContext.Provider value={{ data, loading, error, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

type Theme = "light" | "dark" ;

type ThemeContextType = {
  theme: Theme;
  toggleTheme: (value:Theme) => void;
};
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: ProvidersProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    console.log("USE EFFECT RUNNING")
    console.log(theme)
    const html = document.querySelector("html");
    html.removeAttribute("data-theme")
    html.setAttribute("data-theme", localStorage.getItem("theme"))
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    if(theme === newTheme){
      return
    }
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <IDBProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </IDBProvider>
    </SessionProvider>
  );
}
