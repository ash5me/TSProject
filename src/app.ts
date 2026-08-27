import { videos } from './data/videos.js';
import { filterAndSortVideos, formatViews, timeAgo } from './domain/video-utils.js';
import { Video } from './domain/video.js';

let currentSearch = '';
let currentFilter = 'All';
let currentSort = 'newest';

const subscriptionStorageKey = 'mytube-subscription-status';
let isSubscribed = localStorage.getItem(subscriptionStorageKey) === 'true';

const themeStorageKey = 'mytube-theme';
const savedTheme = localStorage.getItem(themeStorageKey);
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
let isDarkMode = savedTheme ? savedTheme === 'dark' : systemThemeQuery.matches;

const gridView = document.getElementById('grid-view') as HTMLDivElement;
const watchView = document.getElementById('watch-view') as HTMLDivElement;
const videoGrid = document.getElementById('video-grid') as HTMLDivElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterSelect = document.getElementById('filter-select') as HTMLSelectElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
const subscribeBtn = document.getElementById('subscribe-btn') as HTMLButtonElement;
const ytLogo = document.getElementById('yt-logo') as HTMLAnchorElement;
const darkModeToggle = document.getElementById('dark-mode-toggle') as HTMLInputElement;
const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
const mainVideoPlayer = document.getElementById('main-video-player') as HTMLVideoElement;
const videoSource = document.getElementById('video-source') as HTMLSourceElement;
const watchTitle = document.getElementById('watch-title') as HTMLHeadingElement;
const watchMeta = document.getElementById('watch-meta') as HTMLParagraphElement;
const watchDescription = document.getElementById('watch-description') as HTMLParagraphElement;
const sidebarVideoList = document.getElementById('sidebar-video-list') as HTMLDivElement;

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

function openWatchPage(video: Video, updateHash = true) {
  videoSource.src = video.videoUrl;
  mainVideoPlayer.muted = true;
  mainVideoPlayer.load();
  mainVideoPlayer.play().catch(() => undefined);

  watchTitle.textContent = video.title;
  watchMeta.textContent = `${formatViews(video.views)} views • ${timeAgo(video.uploadDate)} • ${video.category}`;
  watchDescription.textContent = video.description;
  renderSidebar(video.id);
  gridView.classList.add('is-hidden');
  watchView.classList.remove('is-hidden');
  window.scrollTo(0, 0);

  if (updateHash) window.location.hash = `watch?id=${video.id}`;
}

function closeWatchPage(updateHash = true) {
  mainVideoPlayer.pause();
  watchView.classList.add('is-hidden');
  gridView.classList.remove('is-hidden');
  if (updateHash) window.location.hash = '';
}

function handleRouting() {
  const hash = window.location.hash;
  if (hash.startsWith('#watch?id=')) {
    const videoId = hash.split('id=')[1];
    const targetVideo = videos.find(video => video.id === videoId);
    if (targetVideo) {
      openWatchPage(targetVideo, false);
      return;
    }
  }
  closeWatchPage(false);
}

function renderSidebar(currentVideoId: string) {
  sidebarVideoList.innerHTML = '';
  videos.filter(video => video.id !== currentVideoId).forEach(video => {
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

function renderVideos() {
  const filteredVideos = filterAndSortVideos(videos, currentSearch, currentFilter, currentSort);
  videoGrid.innerHTML = '';

  if (filteredVideos.length === 0) {
    videoGrid.innerHTML = '<div class="column is-12 has-text-centered py-6"><p class="title is-5 has-text-grey">No videos found.</p></div>';
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
          <p class="is-size-7 has-text-grey mb-2">${formatViews(video.views)} views • ${timeAgo(video.uploadDate)}</p>
          <span class="tag is-light is-small">${video.category}</span>
        </div>
      </div>
    `;
    cardCol.querySelector('.video-card')?.addEventListener('click', () => openWatchPage(video));
    videoGrid.appendChild(cardCol);
  });
}

function init() {
  if (!savedTheme) {
    systemThemeQuery.addEventListener('change', event => {
      isDarkMode = event.matches;
      updateTheme();
    });
  }

  searchInput.addEventListener('input', event => {
    currentSearch = (event.target as HTMLInputElement).value;
    renderVideos();
  });
  filterSelect.addEventListener('change', event => {
    currentFilter = (event.target as HTMLSelectElement).value;
    renderVideos();
  });
  sortSelect.addEventListener('change', event => {
    currentSort = (event.target as HTMLSelectElement).value;
    renderVideos();
  });
  subscribeBtn.addEventListener('click', () => {
    isSubscribed = !isSubscribed;
    localStorage.setItem(subscriptionStorageKey, String(isSubscribed));
    updateSubscribeButton();
  });
  darkModeToggle.addEventListener('change', () => {
    isDarkMode = darkModeToggle.checked;
    localStorage.setItem(themeStorageKey, isDarkMode ? 'dark' : 'light');
    updateTheme();
  });
  backBtn.addEventListener('click', () => closeWatchPage(true));
  ytLogo.addEventListener('click', event => {
    event.preventDefault();
    if (window.location.hash) window.location.hash = '';
    else window.location.reload();
  });
  window.addEventListener('hashchange', handleRouting);

  updateTheme();
  updateSubscribeButton();
  renderVideos();
  handleRouting();
}

init();
