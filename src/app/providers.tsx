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
  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    function isGreaterThanDay(timestamp: number): boolean {
      const currentTime = Date.now();
      const oneDayMilliseconds = 24 * 60 * 60 * 1000;
      // Number of milliseconds in a day
      return timestamp > currentTime + oneDayMilliseconds;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userInfo = await readUser(session?.user?.email);
        //this means the user just signed up!
        //This code will run if the userData is not in the database
        if (!userInfo) {
          console.log("no user info");
          const response = await fetch(
            `/api/user?email=${session?.user?.email}`
          );
          let newUser = await response.json();
          //add some error handling for newUser.error or whaterver the console.log of the response is
          newUser = {
            ...newUser,
            last_synced: Date.now(),
          };
          console.log("THIS IS THE USER THAT WE FETCHED THAT IS NEW");
          console.log(newUser);
          return updateUserData(newUser);
        }
        // This will run if the last time it was synced is greater than 24 hours. We will first insure that there are no updates pending, if ther are, we will fetch the DB to update, and simply just return.
        if (isGreaterThanDay(userInfo.last_synced)) {
          //check if there are modifications
          if (userInfo.is_modified) {
            const {
              firstName,
              lastName,
              email,
              createdAt,
              username,
              plants,
              last_synced,
            } = userInfo;
            const updateUserInfoReq = await fetch(
              `/api/user?email=${session.user.email}`,
              {
                method: "POST",
                body: JSON.stringify({
                  firstName,
                  lastName,
                  email,
                  createdAt,
                  username,
                  plants,
                  last_synced,
                }),
              }
            );
            const responseData = await updateUserInfoReq.json();
            if (responseData.message !== "All data uploaded") {
              throw new Error("Error uploading to db");
            }
            // console.log("we gotta save data to db by fetching updateUser");
            //we should return updateUserData with current user info, just delete isModified. Additionally, I must return
            // if response.
            //perform a fetch request if there's something to update
            //add some error handling for failed update.error or whaterver the console.log of the response is
            userInfo.is_modified = false;
            return updateUserData(userInfo);
          }
          //this means user is out of sync, just perform daily query
          const response = await fetch(`/api/user?email=${session.user.email}`);
          let syncronizedUser = await response.json();
          syncronizedUser = {
            ...syncronizedUser,
            last_synced: Date.now(),
          };
          return updateUserData(syncronizedUser);
        }
        return updateUserData(userInfo);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" || data !== null) {
      return;
    }
    const tryLastLoggedIn = async () => {
      //Check if no session, so that there's a user trying to
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
      // attempt to validate the user
      const validToken = isTokenValid(userInfo.expires);
      if (!validToken) {
        setError("Offline or Unauthenticated");
        setLoading(false);
        return;
      }
      const backupUserValidated = await readUser(userInfo.email);
      if (!backupUserValidated) {
        setError("Offline or Unauthenticated");
        setLoading(false);
        return;
      }
      updateUserData(backupUserValidated);
    };
    tryLastLoggedIn();
  }, [loading, session, data]);

  const updateUserData = async (user) => {
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

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: (value: Theme) => void;
};
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: ProvidersProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const html = document.querySelector("html");
    html.removeAttribute("data-theme");
    html.setAttribute("data-theme", localStorage.getItem("theme"));
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    if (theme === newTheme) {
      return;
    }
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <IDBProvider>{children}</IDBProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
