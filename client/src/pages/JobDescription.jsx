import React from 'react'
import { BsSuitcaseLg } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { GoOrganization } from "react-icons/go";
import { FaRupeeSign } from "react-icons/fa";

const JobDescription = () => {
  return (
    <div className="w-full mt-5 flex flex-col items-center justify-center lato-regular">
      <div class="w-[30%] mx-auto mt-5">
        <div class="mb-3">
        <h1 className="assistant text-3xl mb-3">
            Full Stack Developer
        </h1>
        </div>

        <div class="mb-2 flex">
        <GoOrganization size={18} className="mt-1"/>
        <p className="lato-regular ml-2 mb-2">
            ABC Tech Pvt. Ltd.
        </p>
        </div>

        <div class="mb-2 flex">
        <IoLocationOutline size={18} className="mt-1" />
        <p className="lato-regular ml-2 mb-2">
            Guwahati, Assam
        </p>
        </div>

        <div class="mb-2 flex">
        <BsSuitcaseLg size={18} className="mt-1" />
            <p className="lato-regular ml-2">Full Time</p>
        </div>
        
        <div class="mb-2 flex">
        <FaRupeeSign size={18} className="mt-1"/>
        <p className="lato-regular ml-2">
            20,000/month
        </p>
        </div>
        

        <div className="mb-5">
        <h2 className='mb-4 text-xl font-bold'>About The Job:</h2>
            <div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, consequatur.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, consequatur.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, consequatur.</p>
            </div>

        </div>
        
        <button
          type="submit"
          class="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant"
        >
          Apply For This Role
        </button>
      </div>
    </div>
  )
}

export default JobDescription