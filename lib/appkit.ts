import { AppKit } from "@circle-fin/app-kit";

/**
 * App Kit wraps Circle's Send/Bridge/Swap + Unified Balance.
 *
 * If your App Kit build expects the API key explicitly, pass it here, e.g.:
 *   new AppKit({ apiKey: process.env.KIT_KEY })
 * The current package reads it from the environment, so `new AppKit()` is kept.
 */
const kit = new AppKit();

export default kit;
