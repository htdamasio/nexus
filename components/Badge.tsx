
interface BadgeProps {
  children?: React.ReactNode | React.ReactNode[]
  content: React.ReactNode | string
  color?: 'nexus' | 'red' | 'green' | 'blue' | 'indigo'
}

export function Badge({content, children, color='nexus'}: BadgeProps) {
  function getColor() {
    switch(color){ 
      case "nexus": return 'bg-nexus-9 dark:bg-nexus-11';
      case "red": return 'bg-red-500'
      case "green": return 'bg-green-500'
      case "blue":  return 'bg-blue-500'
      case "indigo":  return 'bg-indigo-500'
    }
  }
  
  return(
    <div className="bg-transparent">
      <div className="relative py-2">
        <div className="absolute !overflow-y-visible -top-0 -right-1 z-10">
          <div className={`flex items-center justify-center rounded-full ${getColor()} p-2 text-[.6rem] text-gray-1`}>{content}</div>
        </div>
        {children}
      </div>
    </div>
  );
}