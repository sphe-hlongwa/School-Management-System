/**
 * MHSAuth - shared session helper for Mbambangwe High School portals.
 *
 * Backend contract (per portal, e.g. admin):
 *   POST /api/admin/login   body: { ...credentials }
 *   200 OK -> { token: "..." }
 *   401    -> { message: "..." }  (or { error: "..." })
 *
 * Token is stored in localStorage when "remember me" is checked,
 * otherwise sessionStorage (cleared when the tab/browser closes).
 */
(function (global) {
    const TOKEN_KEY = 'mhs_auth_token';
    const ROLE_KEY = 'mhs_auth_role';

    // The backend login endpoints aren't implemented yet. Until they are,
    // logins are simulated locally so the portals can still be demoed without
    // failed network requests. Flip this to true once the backend is live.
    const BACKEND_ENABLED = false;

    function saveSession(token, role, remember) {
        const store = remember ? localStorage : sessionStorage;
        // Make sure only one storage holds the session at a time.
        clearSession();
        store.setItem(TOKEN_KEY, token);
        store.setItem(ROLE_KEY, role);
    }

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ROLE_KEY);
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    }

    function getRole() {
        return localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY);
    }

    /**
     * Logs in against a portal-specific endpoint.
     * @param {Object} opts
     * @param {string} opts.endpoint - e.g. '/api/admin/login'
     * @param {Object} opts.body - credentials to send as JSON
     * @param {boolean} opts.remember - persist across browser restarts
     * @param {string} opts.role - 'admin' | 'parent' | 'staff' | 'student'
     * @returns {Promise<Object>} the parsed response body on success
     * @throws {Error} with a user-facing message on failure
     */
    async function login({ endpoint, body, remember, role }) {
        if (!BACKEND_ENABLED) {
            // Backend not implemented yet - simulate a successful login
            // instead of calling a real (currently nonexistent) endpoint.
            const fakeToken = 'demo-' + role + '-' + Date.now();
            saveSession(fakeToken, role, remember);
            return { token: fakeToken };
        }

        let response;
        try {
            response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } catch (networkErr) {
            throw new Error('Could not reach the server. Please check your connection and try again.');
        }

        let data = null;
        try {
            data = await response.json();
        } catch (parseErr) {
            // No/invalid JSON body - fall through to status-based handling below.
        }

        if (!response.ok) {
            const message = (data && (data.message || data.error)) ||
                (response.status === 401
                    ? 'Incorrect email/ID or password.'
                    : 'Something went wrong. Please try again.');
            throw new Error(message);
        }

        if (!data || !data.token) {
            throw new Error('Unexpected response from the server.');
        }

        saveSession(data.token, role, remember);
        return data;
    }

    function logout(redirectTo) {
        clearSession();
        if (redirectTo) {
            global.location.href = redirectTo;
        }
    }

    global.MHSAuth = {
        login,
        logout,
        clearSession,
        getToken,
        getRole
    };
})(window);
