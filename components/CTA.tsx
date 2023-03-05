"use client";
import { useState } from "react";
import { BetaSignUpModal } from "./BetaSignUpModal";

export function CTA() {
  const [signUp, setSignUp] = useState(false)

  function handleModalCLose(modalState: boolean) {
    setSignUp(false)
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-1 justify-center">
        <div className="px-6 pt-16 pb-8 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:flex-auto lg:py-16 lg:text-left">
            <h2 className="text-2xl font-rubik font-bold tracking-tight text-charleston-green sm:text-4xl">
              Join Nexus&apos;s beta!
            </h2>
            <p className="mt-6 text-lg font-roboto font-light leading-6 text-united-nations-blue">
            Start sharing your unique voice with the world. With access to valuable resources and a supportive community, you&apos;ll have everything you need to succeed.
            </p>
            <div className="flex flex-1 mt-10">
                <a className="w-full text-center text-sm py-2 px-6 mx-12 rounded-lg font-montserrat text-medium cursor-pointer text-cultured leading-6 bg-united-nations-blue hover:bg-[#93C2FF]" onClick={() => setSignUp(true)}>
                  BETA SIGN-UP 
                </a>
              </div>  
          </div>
        </div>
      </div>
      {signUp ? <BetaSignUpModal onModalClose={handleModalCLose}/> : <></>}
    </div>
  );
}