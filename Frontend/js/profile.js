const API_BASE = 'http://localhost:5000';
const TOKEN_KEY = 'debatePlatformToken';

async function loadProfile() {
  const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const token = localStorage.getItem(TOKEN_KEY);
  if (!current || !token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/users/${current.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await response.json();
    if (!response.ok) {
      throw new Error(user.message || 'Unable to load profile');
    }

    const nameEl = document.querySelector('.profile-info h1');
    const usernameEl = document.querySelector('.profile-username');
    const roleEl = document.querySelector('.profile-role');
    const bioEl = document.querySelector('.profile-bio');
    const avatarImg = document.querySelector('.profile-image img');

    if (nameEl) nameEl.textContent = user.fullName || user.username || 'User';
    if (usernameEl) usernameEl.textContent = '@' + (user.username || (user.email || '').split('@')[0]);
    if (roleEl) roleEl.textContent = `ROLE: ${user.role?.toUpperCase() || 'USER'}`;
    if (bioEl) bioEl.textContent = user.bio || 'No bio yet.';
    if (avatarImg) avatarImg.src = user.avatar || 'images/default-avatar.svg';

    localStorage.setItem('currentUser', JSON.stringify({ id: user._id, username: user.username, email: user.email, role: user.role }));
  } catch (error) {
    alert('Failed to load profile. Please login again.');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', loadProfile);

async function editProfile() {
  const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const token = localStorage.getItem(TOKEN_KEY);
  if (!current || !token) return alert('No user logged in.');

  const bioEl = document.querySelector('.profile-bio');
  const newBio = prompt('Edit your bio:', bioEl?.textContent || '');
  if (newBio === null) return;

  try {
    const response = await fetch(`${API_BASE}/api/users/${current.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio: newBio }),
    });
    const data = await response.json();
    if (!response.ok) {
      return alert(data.message || 'Unable to update profile.');
    }

    localStorage.setItem('currentUser', JSON.stringify({ id: data._id, username: data.username, email: data.email }));
    if (bioEl) bioEl.textContent = data.bio || 'No bio yet.';
    alert('Profile updated successfully.');
  } catch (error) {
    alert('Profile update failed. Please try again later.');
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}
