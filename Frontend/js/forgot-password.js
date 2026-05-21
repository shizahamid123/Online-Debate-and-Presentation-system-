const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.querySelector('.panel-right input[type="email"]');
  const submitBtn = document.querySelector('.panel-right .submit-btn');

  submitBtn && submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();
    if (!email) return alert('Please enter your email.');

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        return alert(data.message || 'Unable to start password reset.');
      }

      alert('Reset token (simulation): ' + data.token);
      const enteredToken = prompt('Enter the reset token you received (simulation):');
      if (!enteredToken) return alert('Reset cancelled.');
      if (enteredToken !== data.token) return alert('Invalid token.');

      const newPass = prompt('Enter your new password:');
      if (!newPass) return alert('Password reset cancelled.');

      const resetResponse = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPass }),
      });
      const resetData = await resetResponse.json();
      if (!resetResponse.ok) {
        return alert(resetData.message || 'Unable to reset password.');
      }

      alert('Password updated successfully. Please login.');
      window.location.href = 'login.html';
    } catch (error) {
      alert('Password reset failed. Please try again later.');
    }
  });
});