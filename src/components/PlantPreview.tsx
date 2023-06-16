import React from "react";

type Props = {};

const PlantPreview = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center max-h-80vh">
      <h1 className="text-secondary text-center"> Envision Your Garden</h1>
      <div className="carousel w-4/5 md:w-2/3 lg:w-1/2">
        <div className="carousel-item relative w-full">
          <img src="/addgif.gif" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default PlantPreview;
