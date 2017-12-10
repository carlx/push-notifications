import { urlB64ToUint8Array } from './utils/crypto';
const APPLICATION_SERVER_PUBLIC_KEY = 'BCbRoq5hANo5iwOz0SyrMEB2E2zuAiDbVb4N8so7l72RrE5KWScisBdiqbKOQZuDzp4ndUNkKTQrjM0g8SmasEw';
export const APPLICATION_SERVER_KEY = urlB64ToUint8Array(APPLICATION_SERVER_PUBLIC_KEY);
