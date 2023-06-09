import { useContext, useState } from "react";
import { UserContext } from "../app/providers";

interface PlantCardProps {
  card: {
    id: string;
    name: string;
    nickname: string;
    birthday: Date;
    plantType: "Indoor" | "Outdoor";
    plantSize: "S" | "M" | "L";
    waterNeeded: number;
    waterAdded: number;
    image: string;
  };
}
const PlantCard: React.FC<PlantCardProps> = ({ card }) => {
  const { data, updateUserData } = useContext(UserContext);
  const [waterMessage, setWaterMessage] = useState("Add Water");
  const [deleteMessage, setDeleteMessage] = useState("Delete Plant");
  const handleDeletePlant = async () => {
    data.plants = data.plants.filter((plant) => plant.id !== card.id);
    setDeleteMessage("Delete Plant");
    updateUserData(data);
  };

  const percentage = ((card.waterAdded / card.waterNeeded) * 100).toFixed(0) || 1;
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const dateToFormat = new Date((card.birthday as any) * 1000);
  const formattedDate = dateToFormat.toLocaleDateString("en-US", options);
  const addWater = () => {
    data.plants = data.plants.map((plant) => {
      if (card.id === plant.id) {
        return {
          ...plant,
          waterAdded: (plant.waterAdded += 1),
        };
      }
      return plant;
    });
    setWaterMessage("Add Water");
    updateUserData(data);
  };

  const updateStatus = (value) => {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    let currentDayOfMonth = currentDate.getDate();
    let numberOfDaysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
    let ontargetGoal = (currentDayOfMonth / numberOfDaysInMonth) * 100;
    if (value === 100) {
      return "Your plant is all watered up for the month! :D";
    }
    //determine if on target
    if (value >= ontargetGoal) {
      return "Your plant is hydrated!";
    }
    return `I'm thirsty!`;
  };
  const status = updateStatus(percentage);

  return (
    <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{card.name}</h2>
      <img
        className="mx-auto max-h-300 object-cover"
        src={card.image}
        alt={card.name}
      />
      <p className="mt-2 text-gray-700">{card.nickname}</p>
      <p className="text-gray-700">Birthday: {formattedDate}</p>
      <p className="text-gray-700">Type: {card.plantType}</p>
      <p className="text-gray-700">Size: {card.plantSize}</p>
      <p className="text-gray-700">Status: {status}</p>
      <p className="text-gray-700">
        Water Added: {card.waterAdded} / {card.waterNeeded}
      </p>
      <div className="h-4 bg-gray-200 rounded">
        <div
          className={`h-full rounded transition-width duration-500 animate-pulse ${
            status === "I'm thirsty!" ? "bg-red-400" : "bg-blue-300"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex flex-col">
        <button
          className="p-4 bg-blue-500"
          disabled={status === "I'm thirsty!" ? false : true}
          onClick={() => {
            if (waterMessage === "Add Water") {
              setWaterMessage("Confirm Add Water");
              return;
            }
            addWater();
          }}
        >
          {waterMessage}
        </button>
        <p>Water Status: {percentage}%</p>
        <button
          className="p-4 bg-red-500"
          onClick={() => {
            if (deleteMessage === "Delete Plant") {
              setDeleteMessage("Confirm Delete");
              return;
            }
            handleDeletePlant();
          }}
        >
          {deleteMessage}
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
