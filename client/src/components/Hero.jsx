import { Award, Search, User } from "lucide-react";
import React from "react";
import HeroImg from "../assets/Heroimgs.png";
import CountUp from 'react-countup';

const Hero = () => {
  return (
    <div className="bg-slate-800 pt-14 px-5">
      <div className="lg:h-[600px] max-w-7xl mx-auto flex lg:flex-row flex-col gap-15 lg:gap-0 items-center">
        {/* text section  */}
        <div className="space-y-7 px-2 md:px-4 md:pt-10">
          <h1 className="text-3xl mobile-l:text-4xl mt-10 md:mt-0 md:text-5xl font-extrabold text-gray-200">
            Explore Our
            <span className="text-blue-500"> 14000+</span> <br />
            Online courses for all
          </h1>
          <p className="text-gray-300 text-lg mobile-l:text-[21px] sm:w-[500px] lg:w-[650px]">
             Master today’s most in-demand skills with guided learning from industry experts.
          </p>
          {/* search Bar section */}
          <div className="inline-flex relative">
            <input
              type="text"
              className="bg-gray-200 w-[300px] mobile-m:w-[350px] mobile-l:w-[400px] md:w-[450px] text-gray-800 p-4 pr-40 rounded-lg rounded-r-xl placeholder:text-gray-500"
              placeholder="Search Your course Here.."
            />
            <button className="text-white px-4 py-[14px] flex gap-1 rounded-r-lg items-center bg-blue-500 font-semibold absolute right-0 text-xl">
              Search<Search width={20} height={20} />
            </button>
          </div>
        </div>
        {/* image section  */}
        <div className="flex lg:h-[600px]  items-end relative px-4 md:px-0">
          <img 
           className="w-[430px] shadow-blue-500 drop-shadow-lg"
           src={HeroImg} alt="img" />
          <div className="bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[35%] right-0 px-4 py-2">
            <div className="rounded-full bg-blue-400 p-2 text-white">
              <User/>
            </div>
            <div>
              <h2 className="font-bold text-2xl"><CountUp end={4500}/>+</h2>
              <p className="italic text-sm text-gray-600 leading-none">Active Students</p>
            </div>
          </div>

          <div className="bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[4%] left-0 px-2 py-2">
            <div className="rounded-full bg-blue-400 p-2 text-white">
              <Award/>
            </div>
            <div>
              <h2 className="font-bold text-2xl"><CountUp end={700}/>+</h2>
              <p className="italic text-sm text-gray-600 leading-none">Certified Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
