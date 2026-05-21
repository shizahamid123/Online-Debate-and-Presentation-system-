const TOKEN_KEY = 'debatePlatformToken';

function goTo(page) {
  window.location.href = page;
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

function joinDebate(debateId) {
  window.location.href = 'join-debate.html';
}

function enterRoom() {
  alert('Entering room...');
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const welcomeH1 = document.querySelector('.welcome-section h1');
  if (current && welcomeH1) {
    welcomeH1.textContent = `WELCOME_BACK, ${current.username?.toUpperCase() || current.fullName?.toUpperCase() || 'USER'}`;
  }

  // Populate rooms list (demo)
  const roomList = document.getElementById('room-list');
  if (roomList) {
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    if (rooms.length) {
      roomList.innerHTML = '';
      rooms.forEach(r => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'room-item';
        a.textContent = r.name;
        roomList.appendChild(a);
      });
    }
  }

  const notifToggle = document.getElementById('notif-toggle');
  if (notifToggle) {
    notifToggle.addEventListener('click', function() {
      const notifs = document.getElementById('notifications');
      if (!notifs) return;
      notifs.style.display = notifs.style.display === 'none' ? 'block' : 'none';
    });
  }
});