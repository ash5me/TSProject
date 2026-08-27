// --- Types & Interfaces ---
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  views: number;
  uploadDate: Date;
  category: 'Tutorial' | 'Vlog' | 'Review';
}

// --- Mock Data ---
const videos: Video[] = [
  { 
    id: '1', 
    title: 'Beach day vlog', 
    thumbnail: 'https://picsum.photos/seed/ts/640/360', 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Spending a relaxing day down at the sunny beach! Relax and enjoy the sound of the ocean waves.',
    views: 154000, 
    uploadDate: new Date('2023-10-01'), 
    category: 'Tutorial' 
  },
  { 
    id: '2', 
    title: 'Millionaire yatch vlog', 
    thumbnail: 'https://picsum.photos/seed/vlog1/640/360', 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'A full tour of a luxury yacht while exploring open waters. Behind the scenes of high life travel.',
    views: 89000, 
    uploadDate: new Date('2023-10-15'), 
    category: 'Vlog' 
  },
  { 
    id: '3', 
    title: 'Skyscraper everyday fit', 
    thumbnail: 'https://picsum.photos/seed/mac/640/360', 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Reviewing urban streetwear and outfits suited for working in high-rise skyscraper offices.',
    views: 320000, 
    uploadDate: new Date('2023-11-05'), 
    category: 'Review' 
  },
  { 
    id: '4', 
    title: 'Life of an farmer', 
    thumbnail: 'https://picsum.photos/seed/bulma/640/360', 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'An early morning look into daily operations on a self-sustaining organic farm.',
    views: 45000, 
    uploadDate: new Date('2023-09-20'), 
    category: 'Tutorial' 
  },
  { 
    id: '5', 
    title: 'Solo traveller guide', 
    thumbnail: 'https://picsum.photos/seed/desk/640/360', 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Essential safety and budget tips when traveling abroad completely on your own.',
    views: 112000, 
    uploadDate: new Date('2023-12-01'), 
    category: 'Vlog' 
  },
  { 
    id: '6', 
    title: 'Dark forest alone in the dark?', 
    thumbnail: 'https://picsum.photos/seed/key/640/360', 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoywatches.mp4',
    description: 'Nighttime gear test and review deep inside the quiet woods.',
    views: 67000, 
    uploadDate: new Date('2023-12-10'), 
    category: 'Review' 
  },
];

// --- State ---
let currentSearch = '';
let currentFilter = 'All';
let currentSort = 'newest';
const subscriptionStorageKey = 'mytube-subscription-status';
let isSubscribed = localStorage.getItem(subscriptionStorageKey) === 'true';
const themeStorageKey = 'mytube-theme';
const savedTheme = localStorage.getItem(themeStorageKey);
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
let isDarkMode = savedTheme ? savedTheme === 'dark' : systemThemeQuery.matches;

// --- DOM Elements ---
const gridView = document.getElementById('grid-view') as HTMLDivElement;
const watchView = document.getElementById('watch-view') as HTMLDivElement;
const videoGrid = document.getElementById('video-grid') as HTMLDivElement;

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterSelect = document.getElementById('filter-select') as HTMLSelectElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
const subscribeBtn = document.getElementById('subscribe-btn') as HTMLButtonElement;
const ytLogo = document.getElementById('yt-logo') as HTMLAnchorElement;
const darkModeToggle = document.getElementById('dark-mode-toggle') as HTMLInputElement;

// Watch View Elements
const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
const mainVideoPlayer = document.getElementById('main-video-player') as HTMLVideoElement;
const videoSource = document.getElementById('video-source') as HTMLSourceElement;
const watchTitle = document.getElementById('watch-title') as HTMLHeadingElement;
const watchMeta = document.getElementById('watch-meta') as HTMLParagraphElement;
const watchDescription = document.getElementById('watch-description') as HTMLParagraphElement;
const sidebarVideoList = document.getElementById('sidebar-video-list') as HTMLDivElement;

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

function updateSubscribeButton() {
  subscribeBtn.textContent = isSubscribed ? 'Subscribed' : 'Subscribe';
  subscribeBtn.classList.toggle('is-danger', !isSubscribed);
  subscribeBtn.classList.toggle('is-light', isSubscribed);
}

function updateTheme() {
  document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
  darkModeToggle.checked = isDarkMode;
  darkModeToggle.setAttribute('aria-label', isDarkMode ? 'Disable dark mode' : 'Enable dark mode');
}

// --- Video Navigation Logic ---
function openWatchPage(video: Video) {
  // 1. Update Player Source & Load
  videoSource.src = video.videoUrl;
  mainVideoPlayer.load();
  mainVideoPlayer.play().catch(() => {
    // Graceful fallback if browser blocks auto-play
  });

  // 2. Populate Info
  watchTitle.textContent = video.title;
  watchMeta.textContent = `${formatViews(video.views)} views • ${timeAgo(video.uploadDate)} • ${video.category}`;
  watchDescription.textContent = video.description;

  // 3. Render Sidebar / Suggested Videos
  renderSidebar(video.id);

  // 4. Toggle Views
  gridView.classList.add('is-hidden');
  watchView.classList.remove('is-hidden');
  window.scrollTo(0, 0);
}

function closeWatchPage() {
  mainVideoPlayer.pause();
  watchView.classList.add('is-hidden');
  gridView.classList.remove('is-hidden');
}

function renderSidebar(currentVideoId: string) {
  sidebarVideoList.innerHTML = '';
  const recommended = videos.filter(v => v.id !== currentVideoId);

  recommended.forEach(video => {
    const item = document.createElement('div');
    item.className = 'box p-2 mb-3 video-card';
    item.style.cursor = 'pointer';
    item.innerHTML = `
      <article class="media is-align-items-center">
        <figure class="media-left mb-0">
          <p class="image is-64x64">
            <img src="${video.thumbnail}" alt="${video.title}" style="object-fit: cover; height: 100%; border-radius: 4px;">
          </p>
        </figure>
        <div class="media-content overflow-hidden">
          <div class="content">
            <p class="has-text-weight-bold is-size-7 mb-1 text-truncate">${video.title}</p>
            <p class="is-size-7 has-text-grey mb-0">${formatViews(video.views)} views</p>
          </div>
        </div>
      </article>
    `;

    item.addEventListener('click', () => openWatchPage(video));
    sidebarVideoList.appendChild(item);
  });
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
    const cardCol = document.createElement('div');
    cardCol.className = 'column is-12-mobile is-6-tablet is-4-desktop';
    cardCol.innerHTML = `
      <div class="card video-card">
        <div class="card-image">
          <figure class="image is-16by9">
            <img src="${video.thumbnail}" alt="${video.title}">
          </figure>
        </div>
        <div class="card-content p-4">
          <p class="has-text-weight-bold is-size-6 mb-1 video-title">${video.title}</p>
          <p class="is-size-7 has-text-grey mb-2">
            ${formatViews(video.views)} views • ${timeAgo(video.uploadDate)}
          </p>
          <span class="tag is-light is-small">${video.category}</span>
        </div>
      </div>
    `;

    // Click event to open video watch page
    cardCol.querySelector('.video-card')?.addEventListener('click', () => {
      openWatchPage(video);
    });

    videoGrid.appendChild(cardCol);
  });
}

// --- Event Listeners ---
function init() {
  if (!savedTheme) {
    systemThemeQuery.addEventListener('change', (event) => {
      isDarkMode = event.matches;
      updateTheme();
    });
  }

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
    localStorage.setItem(subscriptionStorageKey, String(isSubscribed));
    updateSubscribeButton();
  });

  // Dark mode
  darkModeToggle.addEventListener('change', () => {
    isDarkMode = darkModeToggle.checked;
    localStorage.setItem(themeStorageKey, isDarkMode ? 'dark' : 'light');
    updateTheme();
  });

  // Back Button Event
  backBtn.addEventListener('click', closeWatchPage);

  // YT Logo Click - Closes watch page if active or reloads
  ytLogo.addEventListener('click', (e) => {
    e.preventDefault();
    if (!watchView.classList.contains('is-hidden')) {
      closeWatchPage();
    } else {
      window.location.reload();
    }
  });

  // Initial Render
  updateTheme();
  updateSubscribeButton();
  renderVideos();
}

// Boot application
init();