"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
    id: string;
    title: string;
};

export default function DocumentForm({ products }: {
    products: Product[];
}) {
    
}