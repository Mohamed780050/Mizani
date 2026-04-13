/**
 * this is for users that are not signed in
 */
export const publicRoutes = ["/", "/legal/privacy", "/legal/terms"];
/**
 * these route will be redirected to when user is not registered
 * @type {string[]}
 */
export const authRoutes: string[] = ["/sign-in", "/sign-up", "/reset-password"];
/**
 * this route should be allowed to every user either he is registered and signed in or not
 */
export const apiAuthPrefix = "/api/auth";
export const apiWebhookPrefix = "/api/webhooks";
export const DEFAULT_LOGIN_REDIRECT = "/settings";

/**
 * Routes that are accessible even when the organization's subscription is expired.
 * This allows users to view billing info and renew their plan.
 */
export const subscriptionExemptRoutes = ["/plan-expired", "/settings"];
