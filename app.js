const galleryEl = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let flatPhotos = [];
let currentIndex = 0;

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function stampFor(iso, index) {
  const d = formatDate(iso);
  return d ? d.toUpperCase() : `#${index + 1}`;
}

function render(events) {
  if (!events.length) {
    galleryEl.innerHTML = '<p class="empty">No photos yet. Add a folder under /photos to get started.</p>';
    return;
  }

  galleryEl.innerHTML = '';
  flatPhotos = [];

  events.forEach((event) => {
    const section = document.createElement('section');
    section.className = 'event';

    const head = document.createElement('div');
    head.className = 'event-head';
    head.innerHTML = `
      <h2 class="event-title">${event.title}</h2>
      ${event.date ? `<span class="event-date">${formatDate(event.date)}</span>` : ''}
      <span class="event-count">${event.photos.length} photo${event.photos.length === 1 ? '' : 's'}</span>
    `;

    const grid = document.createElement('div');
    grid.className = 'grid';

    event.photos.forEach((photo) => {
      const globalIndex = flatPhotos.length;
      flatPhotos.push(photo);

      const btn = document.createElement('button');
      btn.className = 'thumb';
      btn.type = 'button';
      btn.dataset.stamp = stampFor(event.date, globalIndex);
      btn.setAttribute('aria-label', `Open photo: ${photo.alt}`);
      btn.addEventListener('click', () => openLightbox(globalIndex));

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = 'lazy';

      btn.appendChild(img);
      grid.appendChild(btn);
    });

    section.appendChild(head);
    section.appendChild(grid);
    galleryEl.appendChild(section);
  });
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  lbClose.focus();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function updateLightbox() {
  const photo = flatPhotos[currentIndex];
  lbImage.src = photo.src;
  lbImage.alt = photo.alt;
  lbCaption.textContent = `${currentIndex + 1} / ${flatPhotos.length}`;
}

function step(delta) {
  currentIndex = (currentIndex + delta + flatPhotos.length) % flatPhotos.length;
  updateLightbox();
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => step(-1));
lbNext.addEventListener('click', () => step(1));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

fetch('manifest.json')
  .then((res) => res.json())
  .then(render)
  .catch(() => {
    galleryEl.innerHTML = '<p class="empty">Could not load manifest.json.</p>';
  });
