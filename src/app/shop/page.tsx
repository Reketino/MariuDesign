import Image from "next/image";
import Link from "next/link";

import { getSupabaseServerClient } from "@/lib/supabase";

import type { ProductImage } from "@/types/products";

import { getProductImageUrl } from "@/components/admin/products/utils/productImage";
