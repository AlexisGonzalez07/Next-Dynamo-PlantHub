"use client"
import { useContext } from 'react'
import { UserContext } from './providers'
import PlantCard from '../components/PlantCard'
export default function Home() {
  const {data,loading,error} = useContext(UserContext)
  console.log(data,loading,error)
  if(!data){
    return(<div>
      <section>Preview Stuff!</section>
    </div>)
  }

  // const plantCards = [
  //   {
  //     name: "Rose",
  //     nickname: "Rosie",
  //     plantType: "Outdoor",
  //     plantSize: "M",
  //     waterNeeded: 200,
  //     waterAdded: 150,
  //     image: "https://planthub.s3.amazonaws.com/uploads/5cdf2cd0-4472-48c4-b51a-ecdb76ab2584.jpg",
  //   },
  //   {
  //     name: "Lily",
  //     nickname: "Lily",
  //     plantType: "Indoor",
  //     plantSize: "S",
  //     waterNeeded: 100,
  //     waterAdded: 75,
  //     image: "https://planthub.s3.amazonaws.com/uploads/cd7ce7f2-5ad0-4b8e-8d03-38c61aff4f46.jpg",
  //   },
  //   {
  //     name: "Rose",
  //     nickname: "Rosie",
  //     plantType: "Outdoor",
  //     plantSize: "M",
  //     waterNeeded: 200,
  //     waterAdded: 150,
  //     image: "https://planthub.s3.amazonaws.com/uploads/5cdf2cd0-4472-48c4-b51a-ecdb76ab2584.jpg",
  //   },
  //   {
  //     name: "Lily",
  //     nickname: "Lily",
  //     plantType: "Indoor",
  //     plantSize: "S",
  //     waterNeeded: 100,
  //     waterAdded: 75,
  //     image: "https://planthub.s3.amazonaws.com/uploads/cd7ce7f2-5ad0-4b8e-8d03-38c61aff4f46.jpg",
  //   },
  //   {
  //     name: "Rose",
  //     nickname: "Rosie",
  //     plantType: "Outdoor",
  //     plantSize: "M",
  //     waterNeeded: 200,
  //     waterAdded: 150,
  //     image: "https://planthub.s3.amazonaws.com/uploads/5cdf2cd0-4472-48c4-b51a-ecdb76ab2584.jpg",
  //   },
  //   {
  //     name: "Lily",
  //     nickname: "Lily",
  //     plantType: "Indoor",
  //     plantSize: "S",
  //     waterNeeded: 100,
  //     waterAdded: 75,
  //     image: "https://planthub.s3.amazonaws.com/uploads/cd7ce7f2-5ad0-4b8e-8d03-38c61aff4f46.jpg",
  //   },
  //   {
  //     name: "Rose",
  //     nickname: "Rosie",
  //     plantType: "Outdoor",
  //     plantSize: "M",
  //     waterNeeded: 200,
  //     waterAdded: 150,
  //     image: "https://planthub.s3.amazonaws.com/uploads/5cdf2cd0-4472-48c4-b51a-ecdb76ab2584.jpg",
  //   },
  //   {
  //     name: "Lily",
  //     nickname: "Lily",
  //     plantType: "Indoor",
  //     plantSize: "S",
  //     waterNeeded: 100,
  //     waterAdded: 75,
  //     image: "https://planthub.s3.amazonaws.com/uploads/cd7ce7f2-5ad0-4b8e-8d03-38c61aff4f46.jpg",
  //   },
  //   {
  //     name: "Rose",
  //     nickname: "Rosie",
  //     plantType: "Outdoor",
  //     plantSize: "M",
  //     waterNeeded: 200,
  //     waterAdded: 150,
  //     image: "www.s3://planthub/uploads/3c88e352-0092-4093-ba95-6c20af9164ef.jpg",
  //   },
  //   {
  //     name: "Lily",
  //     nickname: "Lily",
  //     plantType: "Indoor",
  //     plantSize: "S",
  //     waterNeeded: 100,
  //     waterAdded: 75,
  //     image: "https://s3://planthub/uploads/3c88e352-0092-4093-ba95-6c20af9164ef.jpg",
  //   },
  // ];
  return (
    <div className="flex flex-col h-full w-full">
    <h1>Welcome User</h1>
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




{/* <main className="flex-1 bg-red-500 w-full flex flex-col items-center justify-around">
{children}
</main> */}

