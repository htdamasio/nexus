"use client";
import Image from "next/image";
import { useState } from "react";
// import { BetaSignUpModal } from "./BetaSignUpModal";

export function Hero() {
  const [signUp, setSignUp] = useState(false)

  function handleModalCLose(modalState: boolean) {
    setSignUp(false)
  }
  return (
    <div className="isolate bg-white">
      <main>
          <div className="relative h-[42rem] sm:h-[50rem] overflow-hidden w-full z-0">
            <div className="w-full h-[31.25rem] absolute bottom-0 z-50 ">
              <div className="text-left max-w-7xl w-full mx-auto">
                {/* Presentation */}
                <div className="flex-1 px-5" >
                  <h1 className="text-5xl font-rubik font-bold tracking-tight text-[#36405A] sm:text-charleston-green sm:text-6xl">
                    We&apos;re Nexus
                  </h1>
                  <p className="mt-1 pl-1 text-lg leading-6 font-roboto font-light text-gray-100 sm:text-charleston-green">
                    <span>
                      Making great stories come to life!
                    </span>
                    <br />
                    <span>
                    Read, write, and be part of a <span className="text-united-nations-blue font-normal">community</span> that loves stories.
                    </span> 
                  </p>
                </div> 

                {/* Readers and Writers */}
                <div className="flex flex-col max-w-[35rem]">
                <div className="mt-10 flex gap-x-16 text-charleston-green px-5">
                  <div className="flex flex-col items-center gap-y-3">
                    <h2 className="text-2xl font-rubik font-medium tracking-tight sm:text-3xl text-[#36405A] sm:text-charleston-green">Readers</h2>
                    <p className="max-w-[15rem] font-roboto font-light text-md text-center text-cultured sm:text-charleston-green">
                      Discover new authors, and be the first to read the next best seller!
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-y-3">
                    <h2 className="text-2xl font-rubik font-medium tracking-tight sm:text-3xl text-[#36405A] sm:text-charleston-green">Writers</h2>
                    <p className="max-w-[15rem] font-roboto font-light text-md text-center text-cultured sm:text-charleston-green">
                      Build a community that supports you, and share your novel with the world.
                    </p>
                  </div>
                </div>
                
                {/* Beta sign up button */}
                  <div className="flex flex-1 justify-center mt-10">
                    <a href="#" className="w-full text-center text-sm py-2 px-6 mx-12 md:mx-24 rounded-lg font-montserrat text-medium text-cultured leading-6 bg-united-nations-blue hover:bg-[#93C2FF]" onClick={() => setSignUp(true)}>
                      BETA SIGN-UP 
                    </a>
                  </div>  
                </div>
              </div> 
            </div>
            <Image 
              className="min-w-[1800px] rotate-12 absolute bottom-[-50px] md:bottom-[-275px] lg:bottom-[-250px] left-1/2 ml-[-920px] z-20 sm:min-w-[2300px]"
              src="/bg-hero-1.png"
              width={1500}
              height={1500}
              alt="background gradient"
            />

            <Image 
              className="absolute bottom-[-100px] right-[-6rem] md:right-[-10rem]  xl:right-60 z-20"
              src="/bg-book-1.png"
              width={600}
              height={600}
              alt="background book"
            />

          </div>
       </main>
       {/* {signUp ? <BetaSignUpModal onModalClose={handleModalCLose}/> : <></>} */}
    </div>
  );
}