import { ReactNode } from "react";

interface SidebarProps {
  children?: ReactNode | ReactNode[];
  open: boolean
}

export function Sidebar({children, open}: SidebarProps) {
  return (
    <div className={` ${open ? '':'hidden'} absolute top-0`}>
      {children}
    </div>
  );
}