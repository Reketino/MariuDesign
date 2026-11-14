type ValidationResult =
| { success: true }
| { success: false; error: string };

export function validateForumTopic(
    title: string,
    content: string,
): ValidationResult {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
}