# AI Product Auto-Fill Setup

To enable the AI Product Auto-Fill feature, you need to configure the Google Gemini API key.

## Steps

1.  **Get a Google Gemini API Key**:
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Create a new API Key.

2.  **Configure Backend**:
    *   Open `server/.env` file.
    *   Add the following line:
        ```env
        GOOGLE_API_KEY=your_api_key_here
        ```

3.  **Restart Server**:
    *   Restart your backend server for the changes to take effect.
        ```bash
        # In server directory
        npm run dev
        ```

## Features Implemented

*   **Image Analysis**: Upload an image to automatically detect product details.
*   **Auto-Fill**: Populates Name, Description, Features, Materials, Dimensions, Colors, SEO fields, and more.
*   **Smart Settings**: Adjust Brand Name, Positioning (Budget/Premium), and Target Market to tailor the AI's content generation.
