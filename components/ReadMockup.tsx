import Image from "next/image";

export function ReadMockup() {
  return (
    <div id="read" className="flex flex-col sm:flex-row items-center justify-center gap-x-10 mt-4">
      <Image 
        src="/cellphone-mockup.png"
        width={250}
        height={150}
        alt="cell phone example"
      />
      <div className="max-w-sm px-10 sm:px-0">
        <h1 className="font-rubik font-bold text-2xl text-center sm:text-left">Read you&apos;re favorite stories anywhere</h1>
        <p className="font-roboto font-light text-md leading-5 text-center sm:text-left">Take your favorite reads with you wherever you go using our mobile app. With our stories, you&apos;ll stay captivated, whether you&apos;re connected to the internet or off the grid.</p>
      </div>
    </div>
  );
}