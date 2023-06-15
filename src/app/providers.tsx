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
  console.log(data);
  console.log(loading);
  console.log(error);
  console.log(session);
  console.log(status);
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
      console.log("THE FETCH DATA HOOK RUNNING BC SESSION AUTHORIZED");
      console.log(session)
      setLoading(true);
      setError(null);
      try {
        console.log("getting info from db")
        const userInfo = await readUser(session?.user?.email);
        //this means the user just signed up!
        //This code will run if the userData is not in the database
        console.log("Info from db")
        console.log(userInfo)
        if (!userInfo) {
          console.log("no user info")
          const response = await fetch(
            `/api/user?email=${session?.user?.email}`
          );
          console.log(response)
          let newUser = await response.json();
          console.log("Fethced user info")
          console.log(newUser)
          //add some error handling for newUser.error or whaterver the console.log of the response is
          newUser = {
            ...newUser,
            last_synced: Date.now(),
          };
          return updateUserData(newUser);
        }
        // This will run if the last time it was synced is greater than 24 hours. We will first insure that there are no updates pending, if ther are, we will fetch the DB to update, and simply just return.
        console.log("Checking if greather than a day")
        if (isGreaterThanDay(userInfo.last_synced)) {
          //check if there are modifications
          console.log("user info is greater than a day")
          if (userInfo.is_modified) {
            const {
              firstName,
              lastName,
              email,
              createdAt,
              username,
              password,
              plants,
              last_synced,
            } = userInfo;
            const updateUserInfoReq = await fetch(`/api/user?email=${session.user.email}`, {
              method: "POST",
              body: JSON.stringify({
                firstName,
                lastName,
                email,
                createdAt,
                username,
                password,
                plants,
                last_synced,
              })})
              const responseData = await updateUserInfoReq.json();
              if(responseData.message !== "All data uploaded"){
                throw new Error("Error uploading to db")

                    }
            // console.log("we gotta save data to db by fetching updateUser");
            //we should return updateUserData with current user info, just delete isModified. Additionally, I must return
            // if response.
            //perform a fetch request if there's something to update
               //add some error handling for failed update.error or whaterver the console.log of the response is
               userInfo.is_modified = false
            return updateUserData(userInfo);
          }
          //this means user is out of sync, just perform daily query
          console.log("GETTING THE LATEST INOFOMRATION THEN")
          const response = await fetch(`/api/user?email=${session.user.email}`);
          let syncronizedUser = await response.json();
             //add some error handling for newUser.error or whaterver the console.log of the response is
          syncronizedUser = {
            ...syncronizedUser,
            last_synced: Date.now(),
          };
          return updateUserData(syncronizedUser);
        }
        console.log("user data is still current, no need to update.")
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
      console.log(
        "THE TRY LAST LOGGIN RAN BC LOADING ALLTHOUGH LOADING IS CURRENTLY TRUE, SESSION IS NOT ONLINE, OR DATA IS NULL BECAUSE USER SIGNED OUT"
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
    console.log("USE EFFECT RUNNING");
    console.log(theme);
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
