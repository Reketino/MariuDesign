import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductImageUrl } from "@/components/admin/products/utils/productImage";
import { createClient } from "@/lib/supabase/server";