
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number,
  weight?: 'thin' | 'normal' | 'bold'
  full?: boolean
  color?: 'red' | 'default'
}

export function Spinner({size = 'md', weight = 'normal', full= true, color = 'default'}: SpinnerProps) {
  function getSize() {
    switch (size) {
      case "xs": return 'w-8 h-8'
      case "sm": return 'w-12 h-12'
      case "md": return 'w-16 h-16'
      case "lg": return 'w-20 h-20'
      case "xl": return 'w-24 h-24'
      default: return `w-${size} h-${size}`
    }
  }

  function getWeitght() {
    switch (weight) {
      case "thin": return 'border-[2px] border-t-[2px]'
      case "normal": return 'border-[4px] border-t-[4px]'
      case "bold": return 'border-[8px] border-t-[8px]'
      default: return `border-[${size}] border-t-[${size}]`
    }
  }

  function borderColor() {
    switch(color) {
      case "default": return `border-t-nexus-8`
      case "red": return `border-t-red-500` 
    }
  }
  return (
    // <div className="absolute top-0 left-0 w-screen h-screen bg-gray-15 dark:bg-gray-1 flex flex-1 items-center justify-center text-center">
    <div className={`${full ? 'w-full h-full bg-transparent flex flex-1 items-center justify-center text-center' : ''}`}>
      <div 
        className=
        {`
          ${getWeitght()} ${borderColor()} rounded-full animate-spin
          ${getSize()}
        `} 
      />
    </div>
  );
}