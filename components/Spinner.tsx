
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function Spinner({size = 'md'}: SpinnerProps) {
  function getSize() {
    switch (size) {
      case "xs": return 'w-8 h-8'
      case "sm": return 'w-12 h-12'
      case "md": return 'w-16 h-16'
      case "lg": return 'w-20 h-20'
      case "xl": return 'w-24 h-24'
    }
  }


  return (
    // <div className="absolute top-0 left-0 w-screen h-screen bg-gray-15 dark:bg-gray-1 flex flex-1 items-center justify-center text-center">
    <div className="w-full h-full bg-transparent flex flex-1 items-center justify-center text-center">
      <div 
        className=
        {`
          border-[8px] border-t-[8px] border-t-nexus-8 rounded-full animate-spin
          ${getSize()}
        `} 
      />
    </div>
  );
}