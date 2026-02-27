import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import { PacmanLoader } from "react-spinners";

export const Custom = ({ children }) => {
  return (
    <>
      <ClerkLoading>
        <div className="flex justify-center items-center h-screen">
          <PacmanLoader color="#000" size={50} />
        </div>
      </ClerkLoading>

      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  );
};
