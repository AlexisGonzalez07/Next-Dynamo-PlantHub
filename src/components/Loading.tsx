import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <span className="loading bg-secondary loading-dots loading-lg"></span>
    </div>
  );
};

export default Loading;
