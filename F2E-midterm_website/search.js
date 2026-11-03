
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-submit-btn');
  if (searchBtn) searchBtn.addEventListener('click', filterTours);
});








function filterTours() {
  const toInput = document.getElementById('to-input');
  const keyword = toInput ? toInput.value.trim().toLowerCase() : '';
  const cards = document.querySelectorAll('.card-item');
  const noResultDiv = document.getElementById('no-result');
  let matchCount = 0;








  cards.forEach(card => {
      const keywords = card.getAttribute('data-keywords') ? card.getAttribute('data-keywords').toLowerCase() : '';
      const titleText = card.querySelector('h4') ? card.querySelector('h4').innerText.toLowerCase() : '';
      if (keyword === '' || keywords.includes(keyword) || titleText.includes(keyword)) {
          card.style.display = 'block';
          matchCount++;
      } else {
          card.style.display = 'none';
      }
  });








  if (noResultDiv) {
      if (matchCount === 0) noResultDiv.classList.remove('hidden');
      else noResultDiv.classList.add('hidden');
  }








  const grid = document.getElementById('tourCardGrid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth' });
}








function resetSearch() {
  const toInput = document.getElementById('to-input');
  const fromInput = document.getElementById('from-input');
  if (toInput) toInput.value = '';
  if (fromInput) fromInput.value = '';
  document.querySelectorAll('.card-item').forEach(card => card.style.display = 'block');
  const noResultDiv = document.getElementById('no-result');
  if (noResultDiv) noResultDiv.classList.add('hidden');
}