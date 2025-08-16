import { ReactNode } from "react";
import { Rana } from "./components/Rana";

export default function Home() {

  return (
    <ContentContainer>
      <Rana />
    </ContentContainer>

  );
}

function ContentContainer({ children }: { children: ReactNode }) {
  return <div className="bg-[url('/RiNG.png')] bg-cover bg-center w-screen h-screen flex flex-col justify-end">
    {children}
  </div>
}