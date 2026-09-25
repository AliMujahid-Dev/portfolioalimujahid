export const mockUser = {
  email: "Admin@bussiness.com",
  password: "@Bussiness.ali12",
  name: "Editorial Administrator",
  role: "Lead Administrator",
  avatar: "EA"
};

// Client-side rate limiting store
let attemptCount = 0;
let lockoutTimer = null;
let lockoutUntil = 0;

export const loginUser = (email, password) => {
  const now = Date.now();
  if (lockoutUntil && now < lockoutUntil) {
    const remainingMin = Math.ceil((lockoutUntil - now) / 60000);
    return { 
      success: false, 
      message: `Security Lockout Active: Too many failed attempts. Access blocked for ${remainingMin} minute(s).` 
    };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const validEmail = mockUser.email.toLowerCase();

  if (cleanEmail === validEmail && password === mockUser.password) {
    attemptCount = 0;
    lockoutUntil = 0;
    return { success: true, user: mockUser };
  }

  attemptCount += 1;
  if (attemptCount >= 5) {
    lockoutUntil = now + (15 * 60 * 1000); // 15 minute lock
    return {
      success: false,
      message: "SECURITY ALERT: 5 failed login attempts detected. System locked for 15 minutes to prevent unauthorized access."
    };
  }

  const remaining = 5 - attemptCount;
  return { 
    success: false, 
    message: `Invalid email or password. Warning: ${remaining} attempt(s) remaining before automatic 15-minute security lock.` 
  };
};
