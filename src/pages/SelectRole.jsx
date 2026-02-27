import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const SelectRole = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const setRole = async (role) => {
    await user.update({
      unsafeMetadata: { role },
    });

    await user.reload();

    // Force new token
    await window.Clerk.session?.getToken({ skipCache: true });

    navigate("/");
  };

  return (
    <>
      <h1 className="text-2xl font-bold flex justify-center mt-20 mb-10">
        Select Your Role
      </h1>
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/128/2995/2995620.png"
            alt=""
          />
          <button
            onClick={() => setRole("student")}
            className="bg-blue-500 text-white px-6 py-2 rounded cursor-pointer"
          >
            Student
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/128/9686/9686232.png"
            alt=""
          />
          <button
            onClick={() => setRole("instructor")}
            className="bg-green-500 text-white px-6 py-2 rounded cursor-pointer"
          >
            Instructor
          </button>
        </div>
      </div>
    </>
  );
};

export default SelectRole;
