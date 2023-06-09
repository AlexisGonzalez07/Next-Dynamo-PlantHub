"use client"
import { useContext } from 'react'
import { UserContext } from './providers'
import PlantCard from '../components/PlantCard'
export default function Home() {
  const {data,loading,error} = useContext(UserContext)

  if(!data){
    return(<div>
      <section>Preview Stuff!</section>
    </div>)
  }

  return (
    <div className="flex flex-col h-full w-full">
    <h1 className="text-center h-9">Welcome to your garden! {data.username}</h1>
    <div className="flex-1 bg-yellow-500 flex flex-col items-center justify-around ">
      <div className="px-4 bg-white w-full md:w-9/10 lg:w-4/5 ">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-black">
          {data.plants.map((card, index) => (
            <PlantCard key={index} card={card} />
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
