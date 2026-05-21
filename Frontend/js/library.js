// Library functionality

document.addEventListener('DOMContentLoaded', () => {
  const search = document.querySelector('.search-input');
  const category = document.querySelector('.category-select');
  const cards = Array.from(document.querySelectorAll('.topic-card'));

  function filter() {
    const q = search?.value.trim().toLowerCase() || '';
    const cat = category?.value || 'All Categories';
    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const matchesQuery = !q || title.includes(q);
      const matchesCat = cat === 'All Categories' || (card.querySelector('.topic-count')?.textContent || '').toLowerCase().includes(cat.toLowerCase()) || card.querySelector('h3')?.textContent.includes(cat);
      card.style.display = (matchesQuery && matchesCat) ? 'flex' : 'none';
    });
  }

  search && search.addEventListener('input', filter);
  category && category.addEventListener('change', filter);
});

function exploreTopic(category) {
  alert('Exploring ' + category + ' topics...');
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}