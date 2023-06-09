"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { readUser, writeUser } from "../utils/idb";

interface ProvidersProps {
  children: ReactNode;
}

const IDBContext = createContext(undefined);

const IDBProvider = ({ children }: ProvidersProps) => {
  const [globalState, setGlobalState] = useState(null);
  const { data: session, status } = useSession(); // Access session information
  useEffect(() => {
    // Read data from IndexedDB on component mount
    const fetchData = async () => {
      if (!session) {
        return;
      }
      const userInfo = await readUser(session?.user?.email);
      //this means it's the user's first time.
      if(!userInfo?.firstName){
        const response = await fetch(`/api/user?email=${session?.user?.email}`)
        const newUser = await response.json()
        return updateGlobalState(newUser)
      }
      setGlobalState(userInfo);
    };

    fetchData();
  }, [session]);

  const updateGlobalState = async (user) => {
    // Update global state and persist to IndexedDB
    await writeUser(user);
    setGlobalState(user);
  };

  // Render the IDBContext.Provider with the updated global state and updateGlobalState function
  return (
    <IDBContext.Provider value={{ globalState, updateGlobalState }}>
      {children}
    </IDBContext.Provider>
  );
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <IDBProvider>{children}</IDBProvider>
    </SessionProvider>
  );
}
