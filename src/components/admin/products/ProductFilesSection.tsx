"use client";

import { useState } from "react";

import type { ProductFile } from "@/types/products";

type ProductFileSectionProp = {
    productId: string;
    files: ProductFile[];
}