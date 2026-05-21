const API_BASE = 'https://online-debate-and-presentation-system-production.up.railway.app/api/auth/signup';
const TOKEN_KEY = 'debatePlatformToken';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    window.location.href = 'dashboard.html';
    return;
  }

  const inputs = document.querySelectorAll('.panel-right .field-input');
  const nameInput = inputs[0];
  const emailInput = inputs[1];
  const pwdInput = inputs[2];
  const confirmInput = inputs[3];
  const submitBtn = document.querySelector('.panel-right .submit-btn');

  submitBtn && submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const fullName = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const password = pwdInput?.value || '';
    const confirm = confirmInput?.value || '';

    if (!fullName || !email || !password || !confirm) return alert('Please fill all fields.');
    if (password !== confirm) return alert('Passwords do not match.');

    const username = fullName.toLowerCase().replace(/\s+/g, '');

    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, username }),
      });
      const data = await response.json();
      if (!response.ok) {
        return alert(data.message || 'Signup failed.');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem('currentUser', JSON.stringify({ id: data.id, username: data.username, email: data.email, role: data.role }));
      alert('Account created successfully. Welcome to the arena!');
      window.location.href = 'dashboard.html';
    } catch (error) {
      alert('Signup failed. Please try again later.');
    }
  });
});