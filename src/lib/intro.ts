/**
 * Session cookie recording that the intro has played.
 *
 * A cookie rather than sessionStorage specifically because the server can read
 * it: the overlay is then simply not rendered on a return visit, which removes
 * the need for a blocking inline script in <head> — and with it the hydration
 * mismatch and React's "script tag inside a component" warning.
 *
 * Deliberately kept in its own module with no imports: the client Intro needs
 * the name, and must not pull next/headers into the browser bundle.
 */
export const INTRO_COOKIE = "ch_intro";
