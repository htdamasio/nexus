import Image from "next/image";

interface FuncCardProps {
  title: string,
  descriptions: React.ReactNode[],
  imgSrc: string,
  imgAlt: string,
  flipped?: boolean,
  id?: string
}

export function FuncCard({id, title, descriptions, imgSrc, imgAlt, flipped = false}: FuncCardProps) {
  function textArea() {
    return (
      <div className="flex flex-col px-4 w-full sm:w-[50%] items-start">
        <h1 className="font-rubik font-bold text-2xl mb-2 md:text-4xl">{title}</h1>
        <div className="flex flex-col gap-y-1"> 
        {descriptions.map(description => {
          return description;
        })}
        </div>
      </div>
    );
  }
  
  return (
    <div id={id ?? ''} className="flex flex-1 flex-col sm:flex-row justify-center gap-x-12 mt-12 py-10 w-[80%] bg-white rounded-lg shadow-sm">
        {flipped ? textArea() : <></>}

        <div className="flex w-full sm:w-[50%] self-center sm:self-auto justify-center py-2 px-4">
        <Image 
          // className="absolute bottom-[-100px] right-[-6rem] md:right-[-10rem]  xl:right-60 z-20"
          src={imgSrc}
          width={250}
          height={250}
          alt={imgAlt}
        />
        </div>
        {!flipped ? textArea() : <></>}
      </div>
  );
}