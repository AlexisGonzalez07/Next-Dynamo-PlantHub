"use client";
import { useContext } from "react";
import { UserContext } from "./providers";
import PlantCard from "../components/PlantCard";
import Loading from "../components/Loading";
export default function Home() {
  const { data, loading, error } = useContext(UserContext);
  console.log(data)
  if (error === "Offline or Unauthenticated") {
    return <h1>Unauthenticated Screen Home, Sign Up Online</h1>;
  } else if (error) {
    return <h1>Undiagnozed home error</h1>;
  }
  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const dateToFormat = new Date();
  const formattedDate = dateToFormat.toLocaleDateString("en-US", options);
  return (
    <div className="flex flex-col h-full w-full justify-around items-center pt-4">
      <div className="stats shadow bg-secondary flex justify-center w-full ">
        <div className="stat lg:w-2/5 place-items-center">
          <div className="stat-title text-primary">User</div>
          <div className="stat-value text-primary">{data.username}</div>
          <div className="stat-desc text-primary">Since Jan 1, 2023</div>
        </div>

        <div className="stat lg:w-2/5 place-items-center">
          <div className="stat-title text-primary">Garden Size</div>
          <div className="stat-value text-primary">4,200</div>
          <div className="stat-desc text-primary">Manage your Garden</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-around mt-2">
        <div className="md:px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 
          lg:grid-cols-1
          gap-2">
            {data.plants.map((card, index) => (
              <PlantCard key={index} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
