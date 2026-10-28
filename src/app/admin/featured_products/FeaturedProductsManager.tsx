"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";

import type { Product, ProductImage } from "@/types/products";
import { getProductImageUrl } from "@/components/admin/products/utils/productImage";

