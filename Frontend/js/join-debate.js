const API_BASE = 'https://online-debate-and-presentation-system-production.up.railway.app';
const TOKEN_KEY = 'debatePlatformToken';
let debates = [];

const debatesList = document.querySelector('.debates-list');
const searchInput = document.querySelector('.search-box');
const categorySelects = Array.from(document.querySelectorAll('.filter-select'));

const getDifficultyLabel = (level) => {
  if (!level) return 'INTERMEDIATE';
  return level.toUpperCase();
};

const getDifficultyClass = (level) => {
  switch ((level || 'intermediate').toLowerCase()) {
    case 'beginner': return 'beginner';
    case 'advanced': return 'advanced';
    default: return 'intermediate';
  }
};

const getVoteCounts = (votes = {}) => {
  let values = [];
  if (Array.isArray(votes)) {
    values = votes;
  } else if (votes && typeof votes === 'object') {
    values = Object.values(votes);
  }
  return {
    upvotes: values.filter(v => v === 'up').length,
    downvotes: values.filter(v => v === 'down').length,
  };
};

function renderDebates(items) {
  if (!debatesList) return;
  debatesList.innerHTML = '';
  if (!items.length) {
    debatesList.innerHTML = '<p class="empty-message">No debates found. Create one or refresh the page.</p>';
    return;
  }

  items.forEach(debate => {
    const joinedCount = debate.participants ? debate.participants.length : 0;
    const maxParticipants = debate.maxParticipants || 8;
    const { upvotes, downvotes } = getVoteCounts(debate.votes ? Object.fromEntries(debate.votes) : debate.votes);
    const commentCount = debate.comments ? debate.comments.length : 0;

    const card = document.createElement('div');
    card.className = 'debate-item';
    card.innerHTML = `
      <div class="debate-item-header">
        <h3>${debate.title}</h3>
        <span class="difficulty ${getDifficultyClass(debate.difficultyLevel)}">${getDifficultyLabel(debate.difficultyLevel)}</span>
      </div>
      <p class="debate-item-desc">${debate.description || 'No description available.'}</p>
      <div class="debate-item-stats">
        <span>👥 ${joinedCount}/${maxParticipants} joined</span>
        <span>⏰ ${debate.duration || 30} min</span>
        <span>🎯 ${debate.category || 'General'}</span>
      </div>
      <div class="debate-feedback">
        <button class="vote-btn upvote" data-id="${debate._id}" data-type="up">▲ ${upvotes}</button>
        <button class="vote-btn downvote" data-id="${debate._id}" data-type="down">▼ ${downvotes}</button>
        <span class="comment-count">💬 ${commentCount} comments</span>
      </div>
      <div class="debate-actions">
        <button class="join-btn" data-id="${debate._id}" ${joinedCount >= maxParticipants ? 'disabled' : ''}>
          ${joinedCount >= maxParticipants ? 'FULL - WAITING LIST' : 'JOIN DEBATE'}
        </button>
      </div>
      <div class="debate-discussion" data-id="${debate._id}">
        <textarea class="comment-input" placeholder="Share your thoughts..." rows="2"></textarea>
        <button class="comment-submit" data-id="${debate._id}">Post Comment</button>
        <div class="comments-list"></div>
      </div>
    `;

    const voteButtons = card.querySelectorAll('.vote-btn');
    voteButtons.forEach(btn => btn.addEventListener('click', () => voteDebate(debate._id, btn.dataset.type)));
    const joinButton = card.querySelector('.join-btn');
    joinButton.addEventListener('click', () => joinDebate(debate._id));
    const commentSubmit = card.querySelector('.comment-submit');
    commentSubmit.addEventListener('click', () => postComment(debate._id, card));

    const commentsList = card.querySelector('.comments-list');
    if (commentsList) {
      if (debate.comments && debate.comments.length) {
        commentsList.innerHTML = debate.comments.map(comment => {
          const author = comment.user?.username || comment.user?.fullName || 'Anonymous';
          return `<div class="comment-item"><strong>${author}:</strong> <span>${comment.content}</span></div>`;
        }).join('');
      } else {
        commentsList.innerHTML = '<p class="comment-empty">No comments yet. Be the first to post.</p>';
      }
    }

    debatesList.appendChild(card);
  });
}

async function fetchDebates(search = '', category = '', level = '') {
  if (!debatesList) return;
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All Categories') params.append('category', category);
    if (level && level !== 'All Levels') params.append('difficulty', level.toLowerCase());

    const response = await fetch(`${API_BASE}/api/debates?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) {
      debatesList.innerHTML = '<p class="empty-message">Unable to load debates.</p>';
      return;
    }
    debates = Array.isArray(data) ? data : [];
    renderDebates(debates);
  } catch (error) {
    debatesList.innerHTML = '<p class="empty-message">Unable to load debates.</p>';
  }
}

async function joinDebate(id) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return window.location.href = 'login.html';

  try {
    const response = await fetch(`${API_BASE}/api/debates/${id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      return alert(data.message || 'Unable to join debate.');
    }

    alert('Joined debate successfully.');
    const search = searchInput?.value.trim() || '';
    const category = categorySelects[0]?.value || '';
    const level = categorySelects[1]?.value || '';
    await fetchDebates(search, category, level);
  } catch (error) {
    alert('Unable to join debate. Please try again later.');
  }
}

async function voteDebate(id, type) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return window.location.href = 'login.html';

  try {
    const response = await fetch(`${API_BASE}/api/debates/${id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type }),
    });
    const data = await response.json();
    if (!response.ok) {
      return alert(data.message || 'Vote failed.');
    }
    await refreshDebates();
  } catch (error) {
    alert('Unable to submit vote.');
  }
}

async function postComment(id, card) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return window.location.href = 'login.html';

  const textarea = card.querySelector('.comment-input');
  const content = textarea?.value.trim();
  if (!content) return alert('Please enter a comment.');

  try {
    const response = await fetch(`${API_BASE}/api/debates/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (!response.ok) {
      return alert(data.message || 'Unable to post comment.');
    }
    textarea.value = '';
    await refreshDebates();
  } catch (error) {
    alert('Unable to post comment.');
  }
}

async function refreshDebates() {
  const search = searchInput?.value.trim() || '';
  const category = categorySelects[0]?.value || '';
  const level = categorySelects[1]?.value || '';
  await fetchDebates(search, category, level);
}

document.addEventListener('DOMContentLoaded', () => {
  refreshDebates();
  searchInput?.addEventListener('input', () => refreshDebates());
  categorySelects.forEach(select => select.addEventListener('change', () => refreshDebates()));
});