import { createClient } from "@/lib/supabase/server";
import { validateAnswer } from "./validation";

import type { CreateProductAnswerInput } from "@/types/questions";

type CreateAnswerResult =
  | {
      success: true;
      questionId: string;
    }
  | {
      success: false;
      error: string;
    };

    