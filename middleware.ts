import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/dashboard",
    "/availibilityHours",
    "/profile",
    "/schedule",
    "/confirm",
    "/meeting-confirmation",
  ],
};
