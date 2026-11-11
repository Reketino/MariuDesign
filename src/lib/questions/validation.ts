type ValidationResult =
| { success: true}
| {success: false; error: string };

export function validateQuestion(
    title: string,
    content: string,
): ValidationResult {
    
}