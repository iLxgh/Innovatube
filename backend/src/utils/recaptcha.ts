import axios from "axios";

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        
        if (!secretKey) {
            console.warn("⚠️  RECAPTCHA_SECRET_KEY not configured, skipping verification");
            return true; // Allow in development if not configured
        }

        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: secretKey,
                    response: token,
                },
            }
        );

        return response.data.success && response.data.score >= 0.5;
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        return false;
    }
};
