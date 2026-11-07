import { getSupabase } from '../config/supabase.js';

/**
 * Authentication middleware that verifies Supabase JWT token.
 * Extracts the user from the token and attaches user details to req.user.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing or malformed Authorization header.',
        error: { code: 'UNAUTHORIZED' }
      });
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabase();

    if (!supabase) {
      // In development mode without Supabase keys, warn and block unauthenticated actions safely
      return res.status(503).json({
        success: false,
        message: 'Authentication service is not configured on the server. Please check SUPABASE_URL and SUPABASE_ANON_KEY.',
        error: { code: 'AUTH_SERVICE_UNAVAILABLE' }
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
        error: { code: 'INVALID_TOKEN', details: error?.message }
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata || {}
    };

    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication verification error.',
      error: { code: 'AUTH_VERIFICATION_FAILED' }
    });
  }
}
