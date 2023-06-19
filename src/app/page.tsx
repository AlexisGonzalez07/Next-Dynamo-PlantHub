"use client";
import { useContext } from "react";
import { UserContext } from "./providers";
import PlantCard from "../components/PlantCard";
import Loading from "../components/Loading";
import AppPreview from "../components/AppPreview";
export default function Home() {
  const { data, loading, error } = useContext(UserContext);
  //we need to filter out is_deleted plants in future versions so that deleted plants can persist so that we can delete those S3 images if no longer needed.
  if (!data && error === "Offline or Unauthenticated") {
    return <AppPreview/>;
  } else if (error) {
    return <h1>Undiagnozed home error</h1>;
  }
  if (loading) {
    return (
      <>
        <Loading/>
      </>
    );
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const dateToFormat = new Date(data?.createdAt);
  const formattedDate = dateToFormat.toLocaleDateString("en-US", options);
  return (
    <div className="flex flex-col h-full w-full justify-around items-center py-2">
      <div className="stats shadow bg-secondary flex justify-center w-full ">
        <div className="stat lg:w-2/5 place-items-center">
          <div className="stat-title text-primary">User</div>
          <div className="stat-value text-primary">{data?.username || data?.firstName}</div>
          <div className="stat-desc text-primary">Since {formattedDate}</div>
        </div>

        <div className="stat lg:w-2/5 place-items-center">
          <div className="stat-title text-primary">Garden Size</div>
          <div className="stat-value text-primary">{data?.plants.length}</div>
          <div className="stat-desc text-primary">Manage your Garden</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-around mt-2">
        <div className="md:px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 
          lg:grid-cols-1
          gap-2">
            {data?.plants.map((card, index) => (
              <PlantCard key={index} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
