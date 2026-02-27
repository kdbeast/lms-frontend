import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
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
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) return <RedirectToSignIn />;

  const role = user.publicMetadata?.role;

  if (role !== "instructor") return <Navigate to="/" />;

  return children;
};
