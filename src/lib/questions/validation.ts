type ValidationResult =
| { success: true}
| {success: false; error: string };

export function validateQuestion(
    title: string,
    content: string,
): ValidationResult {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length < 3 || trimmedTitle.length > 150) {
        return {
            success: false,
            error: "Title must be between 3 and 150 characters.",
        };
    }

    
}