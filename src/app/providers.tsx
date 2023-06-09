"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { readUser, writeUser } from "../utils/idb";

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
  updateUserData: () => {}
});

const IDBProvider = ({ children }: ProvidersProps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession(); // Access session information
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
          const response = await fetch(`/api/user?email=${session?.user?.email}`);
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

  const updateUserData = async (user) => {
    try {
      setLoading(true);
      setError(null);  
      await writeUser(user);
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
      <IDBProvider>{children}</IDBProvider>
    </SessionProvider>
  );
}
