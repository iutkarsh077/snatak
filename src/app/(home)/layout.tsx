import Navbar from "@/components/Navbar";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "SoarX",
  description: "SoarX",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div >
      <Navbar/>
      {children}
    </div>
  );
}