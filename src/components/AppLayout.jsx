import Navbar from "./Navbar";

/**
 * Provides a shared layout for authenticated pages.
 * Renders the navigation bar and the page-specific content.
 */
function AppLayout({ children }) {
  return (
    <div>
      <Navbar />

      <main>{children}</main>
    </div>
  );
}

export default AppLayout;
