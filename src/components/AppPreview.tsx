import React from "react";

type Props = {};

const AppPreview = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center">
        <h1 className="text-secondary text-center"> Envision Your Garden</h1>
      <div className="carousel w-4/5">
  <div id="slide1" className="carousel-item relative w-full">
    <img src="/homegif.gif" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide4" className="btn btn-circle">❮</a> 
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide2" className="carousel-item relative w-full">
    <img src="/themegif.gif" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide3" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide3" className="carousel-item relative w-full">
    <img src="/addgif.gif" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide2" className="btn btn-circle">❮</a> 
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div> 

</div>
    </div>
  );
};

export default AppPreview;
