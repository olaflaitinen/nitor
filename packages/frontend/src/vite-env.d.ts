/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_AI_SERVICE_URL?: string;
    // Add more env variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
