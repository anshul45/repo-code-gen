/**
 * An array of public route paths for the application.
 * These routes are accessible without authentication.
 *
 * @constant
 */
export const publicRoutes = ["/", "/about", "/blog"];

/**
 * An array of authentication route paths.
 * These routes are specifically for authentication processes like sign-in.
 */
export const authRoutes = ["/auth/sign-in"];

/**
 * An array of protected route paths.
 * These routes require authentication to access.
 */
export const protectedRoutes = ["/build/create", "/build/profile", "/build/mvp"];

/**
 * The prefix for API authentication routes.
 * Used to namespace all authentication-related API endpoints.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default path to which users are redirected after a successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/create";
