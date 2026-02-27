import {
  useAuth,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export const AuthenticatedUserRoute = ({ children }) => {
  return (
    <>
      <SignedOut>{children}</SignedOut>
      <SignedIn>
        <Navigate to="/" />
      </SignedIn>
    </>
  );
};

export const AdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn, sessionClaims } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) return <Navigate to="/auth" />;

  const role = sessionClaims?.role;

  if (role !== "instructor") return <Navigate to="/" />;

  return children;
};
