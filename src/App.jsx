import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import Profile from "./pages/student/Profile";
import MyLearning from "./pages/student/MyLearning";
import HeroSection from "./pages/student/HeroSection";

import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";

import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/my-learning",
        element: <MyLearning />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },

      // Admin Routes
      {
        path: "/admin",
        element: <Sidebar />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:userId",
            element: <EditCourse />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
