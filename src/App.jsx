import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import Profile from "./pages/student/Profile";
import MyLearning from "./pages/student/MyLearning";
import HeroSection from "./pages/student/HeroSection";

import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseDetail from "./pages/student/CourseDetail";
import CourseTable from "./pages/admin/course/CourseTable";
import CourseProgress from "./pages/student/CourseProgress";

import SearchPage from "./pages/student/SearchPage";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import { createBrowserRouter, RouterProvider } from "react-router";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";

import {
  AdminRoute,
  AuthenticatedUserRoute,
  ProtectedRoute,
} from "./components/ProtectedRoutes";

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
        path: "/register",
        element: (
          <AuthenticatedUserRoute>
            {" "}
            <Register />{" "}
          </AuthenticatedUserRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthenticatedUserRoute>
            {" "}
            <Login />{" "}
          </AuthenticatedUserRoute>
        ),
      },
      {
        path: "/my-learning",
        element: (
          <ProtectedRoute>
            {" "}
            <MyLearning />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            {" "}
            <Profile />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/course/search",
        element: (
          <ProtectedRoute>
            {" "}
            <SearchPage />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/course-detail/:courseId",
        element: (
          <ProtectedRoute>
            {" "}
            <CourseDetail />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },

      // Admin Routes
      {
        path: "/admin",
        element: (
          <AdminRoute>
            {" "}
            <Sidebar />{" "}
          </AdminRoute>
        ),
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
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
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
