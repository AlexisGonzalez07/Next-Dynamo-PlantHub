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
    //This should be changed so that the data stays, it just includes an is_deleted boolean key if the plant has an uploaded image on the S3 container, so that we can delete it. Eventually, we'll add the objectKey so that we can directly delete it from here.
    data.plants = data.plants.map((plant) => {
      if (plant.id === card.id) {
        return {
          ...plant,
          is_deleted: true,
        };
      }
      return plant;
    });
    updateUserData(data);
  };

  const percentage =
    ((card.waterAdded / card.waterNeeded) * 100).toFixed(0) || 1;
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const dateToFormat = new Date(card.birthday);
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
    <div className="card lg:card-side bg-secondary shadow-xl ">
      <figure>
        <img
          src={card.image || "/modernPlant.jpg"}
          alt={card.name}
          className="max-w-96 max-h-96"
        />
      </figure>
      <div className="card-body text-primary px-1">
        <h2 className="card-title">{card.nickname || card.name}</h2>
        <p>Birthday: {formattedDate}</p>
        <p>Type: {card.plantType}</p>
        <p>Size: {card.plantSize}</p>
        <p>Status: {status}</p>
        <p>
          Water Added: {card.waterAdded} / {card.waterNeeded}
        </p>
        <p>Water Status: {percentage}%</p>
        <div className="card-actions justify-end">
          <progress
            className={`progress progress-${
              status === "I'm thirsty!" ? "error" : "info"
            } w-56`}
            value={percentage}
            max="100"
          ></progress>
          <button
            className="btn btn-secondary"
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
          </button>{" "}
        </div>
      </div>
    </div>

    // <button
    //   className="p-4 bg-red-500"
    //   onClick={() => {
    //     if (deleteMessage === "Delete Plant") {
    //       setDeleteMessage("Confirm Delete");
    //       return;
    //     }
    //     handleDeletePlant();
    //   }}
    // >
    //   {deleteMessage}
    // </button>
  );
};

export default PlantCard;
