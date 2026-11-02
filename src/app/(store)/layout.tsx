import type { ReactNode } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type StoreLayoutProps = {
    children: ReactNode;
};

export default function StoreLayout({
    children,
}: StoreLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <div className="flex-1">
                {children}
            </div>

            <Footer />
        </div>
    )
}