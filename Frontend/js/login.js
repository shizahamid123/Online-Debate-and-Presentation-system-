 const API_BASE = 'https://online-debate-and-presentation-system-production.up.railway.app';
const TOKEN_KEY = 'debatePlatformToken';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    window.location.href = 'dashboard.html';
    return;
  }

  const emailInput = document.querySelector('.panel-right input[type="email"]');
  const pwdInput = document.querySelector('.panel-right input[type="password"]');
  const submitBtn = document.querySelector('.panel-right .submit-btn');

  submitBtn && submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();
    const password = pwdInput?.value || '';
    if (!email || !password) return alert('Please enter email and password.');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return alert(data.message || 'Invalid credentials.');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem('currentUser', JSON.stringify({ id: data.id, username: data.username, email: data.email, role: data.role }));
      window.location.href = 'dashboard.html';
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  });

  // Social buttons (placeholder)
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => alert('Social login is not configured in this demo.'));
  });
});