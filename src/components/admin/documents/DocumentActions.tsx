"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DocumentActtionsProps = {
    documentId: string;
    documentTitle: string;
}