// --- Types & Interfaces ---
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  uploadDate: Date;
  category: 'Tutorial' | 'Vlog' | 'Review';
}

// --- Mock Data ---
const videos: Video[] = [
  { id: '1', title: 'Beach day vlog', thumbnail: 'https://picsum.photos/seed/ts/640/360', views: 154000, uploadDate: new Date('2023-10-01'), category: 'Tutorial' },
  { id: '2', title: 'Millionaire yatch vlog', thumbnail: 'https://picsum.photos/seed/vlog1/640/360', views: 89000, uploadDate: new Date('2023-10-15'), category: 'Vlog' },
  { id: '3', title: 'Skyscraper everyday fit', thumbnail: 'https://picsum.photos/seed/mac/640/360', views: 320000, uploadDate: new Date('2023-11-05'), category: 'Review' },
  { id: '4', title: 'Life of an farmer', thumbnail: 'https://picsum.photos/seed/bulma/640/360', views: 45000, uploadDate: new Date('2023-09-20'), category: 'Tutorial' },
  { id: '5', title: 'Solo traveller guide', thumbnail: 'https://picsum.photos/seed/desk/640/360', views: 112000, uploadDate: new Date('2023-12-01'), category: 'Vlog' },
  { id: '6', title: 'Dark forest alone in the dark?', thumbnail: 'https://picsum.photos/seed/key/640/360', views: 67000, uploadDate: new Date('2023-12-10'), category: 'Review' },
];

// --- State ---
let currentSearch = '';
let currentFilter = 'All';
let currentSort = 'newest';
let isSubscribed = false;

// --- DOM Elements ---
const videoGrid = document.getElementById('video-grid') as HTMLDivElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterSelect = document.getElementById('filter-select') as HTMLSelectElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
const subscribeBtn = document.getElementById('subscribe-btn') as HTMLButtonElement;
const ytLogo = document.getElementById('yt-logo') as HTMLAnchorElement;

// --- Utility Functions ---
function formatViews(views: number): string {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  return "Today";
}

// --- Render Logic ---
function renderVideos() {
  // 1. Filter
  let filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(currentSearch.toLowerCase());
    const matchesCategory = currentFilter === 'All' || video.category === currentFilter;
    return matchesSearch && matchesCategory;
  });

  // 2. Sort
  filteredVideos = filteredVideos.sort((a, b) => {
    switch (currentSort) {
      case 'newest': return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'oldest': return a.uploadDate.getTime() - b.uploadDate.getTime();
      case 'views-high': return b.views - a.views;
      default: return 0;
    }
  });

  // 3. Render to DOM
  videoGrid.innerHTML = '';
  
  if (filteredVideos.length === 0) {
    videoGrid.innerHTML = `<div class="column is-12 has-text-centered py-6"><p class="title is-5 has-text-grey">No videos found.</p></div>`;
    return;
  }

  filteredVideos.forEach(video => {
    const html = `
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <div class="card video-card">
          <div class="card-image">
            <figure class="image is-16by9">
              <img src="${video.thumbnail}" alt="${video.title}">
            </figure>
          </div>
          <div class="card-content p-4">
            <!-- Fixed card typography structure -->
            <p class="has-text-weight-bold is-size-6 mb-1 video-title">${video.title}</p>
            <p class="is-size-7 has-text-grey mb-2">
              ${formatViews(video.views)} views • ${timeAgo(video.uploadDate)}
            </p>
            <span class="tag is-light is-small">${video.category}</span>
          </div>
        </div>
      </div>
    `;
    videoGrid.insertAdjacentHTML('beforeend', html);
  });
}

// --- Event Listeners ---
function init() {
  // Search
  searchInput.addEventListener('input', (e) => {
    currentSearch = (e.target as HTMLInputElement).value;
    renderVideos();
  });

  // Filter
  filterSelect.addEventListener('change', (e) => {
    currentFilter = (e.target as HTMLSelectElement).value;
    renderVideos();
  });

  // Sort
  sortSelect.addEventListener('change', (e) => {
    currentSort = (e.target as HTMLSelectElement).value;
    renderVideos();
  });

  // Subscribe Button
  subscribeBtn.addEventListener('click', () => {
    isSubscribed = !isSubscribed;
    if (isSubscribed) {
      subscribeBtn.textContent = 'Subscribed';
      subscribeBtn.classList.remove('is-danger');
      subscribeBtn.classList.add('is-light');
    } else {
      subscribeBtn.textContent = 'Subscribe';
      subscribeBtn.classList.remove('is-light');
      subscribeBtn.classList.add('is-danger');
    }
  });

  // YT Logo Reload
  ytLogo.addEventListener('click', () => {
    window.location.reload();
  });

  // Initial Render
  renderVideos();
}

// Boot application
init();