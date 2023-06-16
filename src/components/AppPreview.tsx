import React from "react";

type Props = {};

const AppPreview = (props: Props) => {

  return (
    <div className="flex flex-col items-center justify-center max-h-80vh">
      <h1 className="text-secondary text-center"> Envision Your Garden</h1>
      <div className="carousel w-4/5 md:w-2/3 lg:w-1/2">
        <div id="slide1" className="carousel-item relative w-full">
          <img src="/homegif.gif" className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-1 right-1 top-1/2">
            <a href="#slide2" className="btn btn-circle opacity-10">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle opacity-10">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img src="/themegif.gif" className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-1 right-1 top-1/2">
            <a href="#slide1" className="btn btn-circle opacity-10">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle opacity-10">
              ❯
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPreview;
