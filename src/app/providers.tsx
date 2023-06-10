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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!session) {
          return;
        }
        const userInfo = await readUser(session?.user?.email);
        // This means it's the user's first time.
        if (!userInfo?.firstName) {
          const response = await fetch(
            `/api/user?email=${session?.user?.email}`
          );
          console.log(response);
          const newUser = await response.json();
          console.log(newUser);
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
    if (session) {
      return;
    }
    console.log("YOU CAN STILL SAVE THE OFFLINE HERE!");
    const tryLastLoggedIn = async () => {
      //This should be await read last logged in token for still available?
      const userInfo = await readLastLogged();
      if (!userInfo) {
        setError("Offline or Unauthenticated");
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
      }
      const userInPrimary = await readUser(userInfo.email);
      return updateUserData(userInPrimary);
    };
    tryLastLoggedIn();
  }, [loading, session]);

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

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <IDBProvider>{children} </IDBProvider>
    </SessionProvider>
  );
}
