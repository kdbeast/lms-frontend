import { PacmanLoader } from "react-spinners";
import { useGetUserProfileQuery } from "./features/api/authApi";

export const Custom = ({ children }) => {
  const { isLoading } = useGetUserProfileQuery();

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <PacmanLoader color="#000" size={50} />
    </div>
  ) : (
    children
  );
};
