const API_BASE = 'http://localhost:5000';
const TOKEN_KEY = 'debatePlatformToken';

async function handleCreateDebate(event) {
  event.preventDefault();
  const form = document.getElementById('create-debate-form');
  if (!form) return alert('Form not found.');

  const title = form.querySelector('input[type="text"]').value.trim();
  const category = form.querySelector('select').value;
  const difficulty = form.querySelector('input[name="difficulty"]:checked')?.value || 'intermediate';
  const description = form.querySelector('textarea').value.trim();
  const timer = parseInt(form.querySelector('input[type="number"]')?.value) || 30;
  const maxParticipants = parseInt(form.querySelectorAll('input[type="number"]')[1]?.value) || 8;
  const checkboxes = Array.from(form.querySelectorAll('.check-box'));
  const enableVoting = checkboxes[0]?.classList.contains('active');
  const allowChat = checkboxes[1]?.classList.contains('active');
  const requireRegistration = checkboxes[2]?.classList.contains('active');

  if (!title) return alert('Please enter a debate title.');
  if (!category || category === 'Select a category') return alert('Please select a category.');

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return window.location.href = 'login.html';

  try {
    const response = await fetch(`${API_BASE}/api/debates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        category,
        difficultyLevel: difficulty,
        maxParticipants,
        duration: timer,
        enableVoting,
        allowChat,
        requireRegistration,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return alert(data.message || 'Failed to create debate.');
    }

    alert('Debate created successfully!');
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert('Could not create debate. Please try again later.');
  }
}