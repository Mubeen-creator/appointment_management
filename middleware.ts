import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect to home page if not authenticated
  },
});

export const config = {
  matcher: ["/dashboard", "/availibilityHours"], // Protect these routes
};
