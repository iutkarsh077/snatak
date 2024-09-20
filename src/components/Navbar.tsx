"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { checkUser } from "../../actions/checkUser";
import ProfileDropdown from "./ProfileDropDown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [userDetails, setUserDetails] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // initially loading
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const getUserAvailable = async () => {
      try {
        setLoading(true);
        const res = await checkUser();
        if (res.status === false) {
          throw new Error(res.msg);
        }
        // console.log(res);
        setUserDetails(res.userDetails);
      } catch (error: any) {
        console.log(error);
        router.push("/"); // redirect if not logged in
      } finally {
        setLoading(false); // done loading
      }
    };
    getUserAvailable();
  }, [router]);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const navLinks = [
    { route: "/", name: "Home" },
    { route: "/chats", name: "Chats" },
    { route: "/share", name: "Share" },
  ];

  

  // console.log(userDetails)
  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-bold text-lg">SNATAK</span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div
              className={`items-center space-x-1 ${
                pathname === "/signup" ? "hidden" : "hidden md:flex"
              }`}
            >
              {userDetails &&
                navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.route}
                    className="py-4 px-2 hover:text-secondary transition duration-300"
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Profile or Login */}
          <div className="hidden md:block">
            {loading ? (
              <div>Loading...</div> // Placeholder while loading
            ) : userDetails ? (
              <ProfileDropdown username={userDetails.name} />
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {pathname !== "/signup" && pathname !== "/login" && (
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-white z-50 text-primary-foreground absolute top-0 right-0 h-screen w-64 shadow-lg"
          >
            <div className="flex justify-end p-4">
              <button onClick={toggleMenu} className="outline-none">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="items-center flex flex-col">
              {userDetails && <ProfileDropdown username={userDetails.name} />}
              {userDetails &&
                navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.route}
                    className="py-4 px-2 hover:text-secondary transition duration-300"
                  >
                    {link.name}
                  </Link>
                ))}
              {!userDetails && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
