import Image from "next/image";

import React from "react";
import img1 from "@/public/images/bg-img1.jpg";

function Home() {
  return (
    <>
      <div className="min-h-screen  flex flex-col justify-center items-center">
        <div className=" grid grid-cols-2  w-full m-10  gap-2">
          <div className="text-amber-100 h-50 font-thegomies flex justify-center items-center text-9xl  rounded-md ">
            "New <i>Cycle</i>"
          </div>
          <div className=" h-50  rounded-full text-black ">
            <Image
              className="object-cover rounded-full object-center h-full  "
              src={img1}
              alt="img1"
            ></Image>
          </div>
          <div className=" h-50 text-7xl flex flex-row  rounded-md text-black px-4 py-6">
            <button className="rounded-full font-serif hover:scale-95 hover:font-thegomies  transition-all duration-150 ease-in-out bg-black text-4xl  px-40 text-white">
              Ideas
            </button>
            <button className="rounded-full font-serif hover:scale-95 hover:font-thegomies  transition-all duration-150 ease-in-out bg-black text-4xl px-20 text-white">
              Diaries
            </button>
            <button className="rounded-full font-serif hover:scale-95 hover:font-thegomies  transition-all duration-150 ease-in-out bg-black text-4xl px-10 text-white">
              Blogs
            </button>
          </div>
          <div className="text-amber-100 h-50 flex items-center rounded-md px-4 py-6">
            <h1 className="font-thegomies text-8xl">
              the new way to
              <h1 className="text-9xl text-right">
                <i>connect.</i>
              </h1>
            </h1>
          </div>
          <div className="text-amber-100 h-50 flex justify-center items-center  rounded-md  px-4 py-6">
            <button className="font-thegomies text-9xl font-bold hover:bg-amber-100/25 px-2 rounded-2xl transition-all duration-150 ease-in-out">
              Get started
            </button>
          </div>
          <div className="  h-50 rounded-md text-amber-100 flex items-center justify-center px-4 py-6">
          
          </div>
        </div>

      </div>

    </>
  );
}

export default Home;
