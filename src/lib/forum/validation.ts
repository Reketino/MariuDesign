type ValidationResult =
| { success: true }
| { success: false; error: string };

export function validateForumTopic(
    title: string,
    content: string,
): ValidationResult {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length < 3 || trimmedTitle.length > 150 ) {
        return {
            success: false,
            error: "Title must be between 3 and 150 characters.",
        };
    }

    if (trimmedContent.length < 10 || trimmedContent.length > 10000) {
        return {
            success: false,
            error: "Content must be between 10 and 10000 characters.",
        };
    }

    return { success: true };
}

export function validateForumReply(
    content: string,
): ValidationResult {
    const trimmedContent = content.trim();

    
}