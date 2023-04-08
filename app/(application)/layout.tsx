import { Header } from "@/components/Header";
import { MobileFooterMenu } from "@/components/MobileFooterMenu";

export default function Applicationlayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode,
}) {
  return (
    <section>
      <div className="w-full h-full bg-gray-15 dark:bg-gray-1">
        <Header />
          {children}
        {/* <MobileFooterMenu/> */}
      </div>
    </section>
  );
}