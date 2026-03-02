import { Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

export const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) return <Navigate to="/auth" />;

  return children;
};

export const AuthenticatedUserRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (isSignedIn) return <Navigate to="/" />;

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) return <Navigate to="/auth" />;

  const role = user?.unsafeMetadata?.role;

  if (role !== "instructor") return <Navigate to="/" />;

  return children;
};
