import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type { ProductImage } from "@/types/products";

import { getProductImageUrl } from "@/components/admin/products/utils/productImage";