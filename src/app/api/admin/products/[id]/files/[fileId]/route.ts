import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { deleteProductFile } from "@/components/admin/products/utils/productFileService";