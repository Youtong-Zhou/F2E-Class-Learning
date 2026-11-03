// ==========================================
// 全域模組: Header 渲染 + 跨頁登入狀態 + 購物車、優惠券、獨立旅行日誌與評價連動
// (特色：搜尋全公開；自由行與主題團旅預約/加購物車須會員驗證，未登入自動跳彈窗)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  initClaimedCoupons();
  initMockCompletedActivities();
  initSearchEventListener();
});

function loadHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  const headerHTML = `
  <header class="bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-stone-200/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 border-b border-stone-100/80">
        <!-- Logo -->
        <a href="index.html" class="flex-shrink-0 flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-coral-600 text-white flex items-center justify-center shadow-md">
            <i class="fa-solid fa-compass text-xl"></i>
          </div>
          <span class="text-xl font-bold tracking-tight text-slate-800 uppercase">
            WANDERLUST<span class="text-coral-600">.</span>
          </span>
        </a>

        <!-- 右側工具區 -->
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div id="user-auth-area" class="relative">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <button type="button" onclick="openAuthModal('register')" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-coral-300 text-coral-600 hover:bg-coral-50 transition text-sm font-medium cursor-pointer">
                <i class="fa-solid fa-user-plus"></i><span class="hidden sm:inline">JOIN</span>
              </button>
              <button type="button" onclick="openAuthModal('login')" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-coral-600 text-white hover:bg-coral-700 transition text-sm font-medium shadow-sm cursor-pointer">
                <i class="fa-solid fa-right-to-bracket"></i><span class="hidden sm:inline">LOGIN</span>
              </button>
            </div>
          </div>

          <!-- 💡 所有人皆可使用的全站搜尋框 -->
          <div class="relative flex items-center border-2 border-coral-600 rounded-full px-2 py-1 bg-white shadow-sm focus-within:ring-2 focus-within:ring-coral-600/30 transition">
            <input type="text" id="searchInput" placeholder="搜尋國家、行程..." class="w-28 sm:w-44 pl-2 pr-7 text-sm bg-transparent outline-none text-dark placeholder-gray-400">
            <button type="button" id="searchBtn" class="absolute right-1.5 w-7 h-7 rounded-full bg-coral-600 hover:bg-coral-700 text-white flex items-center justify-center transition cursor-pointer">
              <i class="fa-solid fa-magnifying-glass text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 下排導覽選單 -->
      <nav class="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-6 py-2">
        <a href="index.html" data-page="index" class="nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-stone-600 hover:text-coral-600 inline-flex items-center">首頁</a>
        
        <div class="relative group inline-block">
          <a href="theme.html" data-page="theme" class="nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-stone-600 hover:text-coral-600 inline-flex items-center gap-1">
            主題團旅 <i class="fa-solid fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
          </a>
          <div class="dropdown-menu absolute left-0 top-full pt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
            <div class="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-stone-200/60 py-2">
              <a href="theme.html#flower" class="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-coral-50 hover:text-coral-600 transition"><i class="fa-solid fa-fan text-coral-300 w-6"></i> 賞花 (flower)</a>
              <a href="theme.html#snow" class="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-coral-50 hover:text-coral-600 transition"><i class="fa-regular fa-snowflake text-teal-600 w-6"></i> 雪景 (snow)</a>
              <a href="theme.html#food" class="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-coral-50 hover:text-coral-600 transition"><i class="fa-solid fa-utensils text-coral-600 w-6"></i> 美食 (food)</a>
              <a href="theme.html#culture" class="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-coral-50 hover:text-coral-600 transition"><i class="fa-solid fa-torii-gate text-teal-700 w-6"></i> 文化 (culture)</a>
              <a href="theme.html#others" class="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-coral-50 hover:text-coral-600 transition"><i class="fa-solid fa-compass text-gray-400 w-6"></i> 其他 (others)</a>
            </div>
          </div>
        </div>

        <a href="free.html" data-page="free" class="nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-stone-600 hover:text-coral-600">自由行</a>
        <a href="custom.html" data-page="custom" class="nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-stone-600 hover:text-coral-600">客製團旅</a>
      </nav>
    </div>
  </header>

  <!-- 💡 會員登入 Modal -->
  <div id="login-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" style="display: none;">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
      <button type="button" onclick="closeAuthModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      <div class="text-center">
        <h3 class="text-xl font-bold text-gray-800">會員登入</h3>
        <p class="text-xs text-coral-600 mt-1 font-semibold">🔒 預訂主題團旅與自由行前請先登入會員帳號</p>
      </div>
      <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
        <div><label class="block text-xs font-bold text-gray-600 mb-1">電子信箱</label><input type="email" id="login-email" required placeholder="請輸入 Email" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-600"></div>
        <div><label class="block text-xs font-bold text-gray-600 mb-1">密碼</label><input type="password" id="login-password" required placeholder="請輸入密碼" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-600"></div>
        <button type="submit" class="w-full py-3 bg-coral-600 hover:bg-coral-700 text-white font-bold rounded-xl transition shadow-md text-sm mt-2 cursor-pointer">登入帳號</button>
      </form>
      <div class="text-center pt-2 border-t border-stone-100">
        <p class="text-xs text-stone-500">還沒有會員帳號？ <button onclick="openAuthModal('register')" class="text-coral-600 font-bold hover:underline cursor-pointer">立即免費註冊</button></p>
      </div>
    </div>
  </div>

  <!-- 💡 會員註冊 Modal -->
  <div id="register-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" style="display: none;">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
      <button type="button" onclick="closeAuthModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      <div class="text-center">
        <h3 class="text-xl font-bold text-gray-800">註冊新會員</h3>
        <p class="text-xs text-coral-600 mt-1 font-semibold">✨ 免費加入會員即可解鎖預訂主題團旅與自由行權限</p>
      </div>
      <form onsubmit="handleRegisterSubmit(event)" class="space-y-4">
        <div><label class="block text-xs font-bold text-gray-600 mb-1">姓名</label><input type="text" id="register-name" required placeholder="請輸入姓名" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-600"></div>
        <div><label class="block text-xs font-bold text-gray-600 mb-1">電子信箱</label><input type="email" id="register-email" required placeholder="請輸入 Email" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-600"></div>
        <div><label class="block text-xs font-bold text-gray-600 mb-1">設定密碼</label><input type="password" id="register-password" required placeholder="請設定密碼" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-600"></div>
        <button type="submit" class="w-full py-3 bg-coral-600 hover:bg-coral-700 text-white font-bold rounded-xl transition shadow-md text-sm mt-2 cursor-pointer">完成註冊並登入</button>
      </form>
      <div class="text-center pt-2 border-t border-stone-100">
        <p class="text-xs text-stone-500">已有會員帳號？ <button onclick="openAuthModal('login')" class="text-coral-600 font-bold hover:underline cursor-pointer">點此直接登入</button></p>
      </div>
    </div>
  </div>

  <!-- 我的優惠券 Modal -->
  <div id="coupons-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" style="display: none;">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative space-y-5">
      <button type="button" onclick="closeAuthModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      <div class="flex items-center gap-2 border-b border-stone-200 pb-3">
        <i class="fa-solid fa-ticket text-teal-600 text-2xl"></i>
        <div><h3 class="text-lg font-bold text-gray-800">我的優惠券清單</h3></div>
      </div>
      <div id="coupons-list-container" class="space-y-3 max-h-[60vh] overflow-y-auto pr-1"></div>
    </div>
  </div>

  <!-- 給予評價 Modal -->
  <div id="review-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center p-4" style="display: none;">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5">
      <button type="button" onclick="closeReviewModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      <div>
        <h3 class="text-lg font-bold text-gray-800">活動評價與旅行日誌</h3>
        <p id="review-tour-title" class="text-xs font-semibold text-coral-600 mt-1">行程名稱</p>
      </div>

      <form onsubmit="submitReview(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1.5"><span class="text-red-500 mr-0.5">*</span>整體滿意度</label>
          <div class="flex items-center gap-2 text-2xl text-stone-300" id="star-rating-container">
            <i class="fa-solid fa-star cursor-pointer hover:text-amber-400 transition" onclick="setRating(1)"></i>
            <i class="fa-solid fa-star cursor-pointer hover:text-amber-400 transition" onclick="setRating(2)"></i>
            <i class="fa-solid fa-star cursor-pointer hover:text-amber-400 transition" onclick="setRating(3)"></i>
            <i class="fa-solid fa-star cursor-pointer hover:text-amber-400 transition" onclick="setRating(4)"></i>
            <i class="fa-solid fa-star cursor-pointer hover:text-amber-400 transition" onclick="setRating(5)"></i>
          </div>
          <span id="star-rating-text" class="text-xs font-bold text-amber-500 mt-1 block">5.0 分 (非常滿意)</span>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1"><span class="text-red-500 mr-0.5">*</span>實際參與日期</label>
          <input type="date" id="review-date" required class="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-coral-600">
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-xs font-bold text-gray-600">
              旅遊心得 <span class="text-teal-600 font-bold">(🎁 填寫超過 30 字即贈 88 折折扣券！)</span>
            </label>
            <span id="char-count" class="text-[11px] font-bold text-stone-400">目前 0 字 / 門檻 30 字</span>
          </div>
          <textarea id="review-comment" rows="4" oninput="updateCharCount()" placeholder="請分享您的精彩旅程體驗，填寫滿 30 字即可自動獲得 88 折優惠券..." class="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-coral-600"></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">上傳活動精彩照片</label>
          <input type="file" id="review-photo-input" accept="image/*" onchange="previewReviewPhoto(event)" class="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-coral-50 file:text-coral-600 hover:file:bg-coral-100 cursor-pointer">
          <div id="photo-preview-container" class="mt-2 hidden">
            <img id="review-photo-img" class="w-24 h-24 object-cover rounded-xl border border-stone-200 shadow-sm" alt="Preview">
          </div>
        </div>

        <button type="submit" class="w-full py-3 bg-coral-600 hover:bg-coral-700 text-white font-bold rounded-xl transition shadow-md text-sm mt-2 cursor-pointer">
          送出評價
        </button>
      </form>
    </div>
  </div>
  `;

  container.innerHTML = headerHTML;
  highlightCurrentNav();
  checkSavedUser();
}

// 💡 所有人（無論是否登入）皆可進行搜尋
function initSearchEventListener() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  const executeSearch = () => {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `allsearch.html?query=${encodeURIComponent(query)}`;
    }
  };

  if (searchBtn) searchBtn.addEventListener('click', executeSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSearch();
    });
  }
}

function highlightCurrentNav() {
  const path = window.location.pathname;
  let page = '';
  if (!path.includes('allsearch') && !path.includes('cart') && !path.includes('journal')) {
    if (path.includes('theme')) page = 'theme';
    else if (path.includes('free')) page = 'free';
    else if (path.includes('custom')) page = 'custom';
    else page = 'index';
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.className = "nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-stone-600 hover:text-coral-600 inline-flex items-center";
  });

  if (page) {
    const activeBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
    if (activeBtn) {
      activeBtn.className = "nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-coral-600 bg-coral-50 font-bold inline-flex items-center";
    }
  }
}

function checkSavedUser() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) updateHeaderUser(savedUser);
}

window.openAuthModal = function(type) {
  closeAuthModal();
  const modal = document.getElementById(`${type}-modal`);
  if (modal) modal.style.display = 'flex';
};

window.closeAuthModal = function() {
  ['login-modal', 'register-modal', 'coupons-modal', 'review-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
};

window.handleRegisterSubmit = function(event) {
  event.preventDefault();
  const nameInput = document.getElementById('register-name');
  const userName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : "新夥伴";
  localStorage.setItem('currentUser', userName);

  closeAuthModal();
  updateHeaderUser(userName);
  initClaimedCoupons();
  initMockCompletedActivities();
  alert(`🎉 歡迎加入 Wanderlust！${userName}，您現在已享有主題團旅與自由行的預訂權限。`);
};

window.handleLoginSubmit = function(event) {
  event.preventDefault();
  const emailInput = document.getElementById('login-email');
  let userName = (emailInput && emailInput.value) ? emailInput.value.split('@')[0] : "夥伴";
  localStorage.setItem('currentUser', userName);
  
  closeAuthModal();
  updateHeaderUser(userName);
  initClaimedCoupons();
  initMockCompletedActivities();
  alert(`🎉 歡迎回來，${userName}！您已成功登入會員。`);
};

function updateHeaderUser(name) {
  const authArea = document.getElementById('user-auth-area');
  if (authArea) {
    authArea.innerHTML = `
    <div class="relative group inline-block">
      <button type="button" class="flex items-center gap-2 px-3 py-1.5 bg-coral-50 text-coral-600 rounded-lg font-bold text-sm hover:bg-coral-100 transition shadow-sm cursor-pointer">
        <i class="fa-solid fa-circle-user text-sm"></i>
        <span>${name}</span>
        <i class="fa-solid fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
      </button>
      <div class="dropdown-menu absolute right-0 top-full pt-1 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all duration-200">
        <div class="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-stone-200/60 py-1.5 space-y-0.5">
          <a href="cart.html" class="flex items-center justify-between px-4 py-2 text-xs text-stone-700 hover:bg-coral-50 hover:text-coral-600 font-semibold transition cursor-pointer">
            <span class="flex items-center gap-2"><i class="fa-solid fa-cart-shopping text-coral-600"></i>我的購物車</span>
            <span id="cart-badge" class="hidden bg-coral-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
          </a>
          <a href="journal.html" class="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-coral-50 hover:text-coral-600 font-semibold transition cursor-pointer">
            <i class="fa-solid fa-book-journal-whills text-amber-600"></i>旅行日誌與足跡
          </a>
          <button type="button" onclick="openCouponsModal()" class="w-full flex items-center justify-between px-4 py-2 text-xs text-stone-700 hover:bg-coral-50 hover:text-coral-600 font-semibold transition cursor-pointer text-left">
            <span class="flex items-center gap-2"><i class="fa-solid fa-ticket text-teal-600"></i>我的優惠券</span>
            <span id="coupon-badge" class="hidden bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
          </button>
          <div class="border-t border-stone-100 my-1"></div>
          <button type="button" onclick="logoutUser()" class="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold transition text-left cursor-pointer">
            <i class="fa-solid fa-right-from-bracket"></i>登出帳號
          </button>
        </div>
      </div>
    </div>
    `;
    updateCartBadge();
    updateCouponBadge();
  }
}

window.updateCartBadge = function() {
  const currentUser = localStorage.getItem('currentUser');
  const badge = document.getElementById('cart-badge');
  if (!badge || !currentUser) return;

  const cartItems = JSON.parse(localStorage.getItem(`user_cart_${currentUser}`) || '[]');
  if (cartItems.length > 0) {
    badge.textContent = cartItems.length;
    badge.classList.remove('hidden');
  } else { badge.classList.add('hidden'); }
};

window.updateCouponBadge = function() {
  const currentUser = localStorage.getItem('currentUser');
  const badge = document.getElementById('coupon-badge');
  if (!badge || !currentUser) return;

  const claimed = JSON.parse(localStorage.getItem(`claimed_coupons_${currentUser}`) || '[]');
  if (claimed.length > 0) {
    badge.textContent = claimed.length;
    badge.classList.remove('hidden');
  } else { badge.classList.add('hidden'); }
};

// 💡 核心功能：加入購物車 / 預訂行程前進行會員驗證
window.addToUserCart = function(itemData) {
  const currentUser = localStorage.getItem('currentUser');

  // 未註冊 / 未登入攔截判斷
  if (!currentUser) {
    alert("🔒 預訂主題團旅與自由行需要會員身分！\n請先登入或免費註冊帳號。");
    openAuthModal('login');
    return false;
  }

  const userCartKey = `user_cart_${currentUser}`;
  let cart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
  cart.push(itemData);
  localStorage.setItem(userCartKey, JSON.stringify(cart));

  updateCartBadge();
  alert(`🎉 成功將【${itemData.title || '行程'}】加入購物車！`);
  return true;
};

let currentRating = 5;
let activeReviewActivityIndex = -1;
let uploadedPhotoBase64 = '';

function initMockCompletedActivities() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  const key = `completed_activities_${currentUser}`;
  if (!localStorage.getItem(key)) {
    const defaultActivities = [
      {
        id: 'act-001',
        title: '日本京都嵐山賞櫻與傳統町家體驗 5 日',
        date: '2026-04-12',
        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80',
        price: 'TWD 42,800',
        reviewed: false
      },
      {
        id: 'act-002',
        title: '泰國曼谷奢華 Villa 與高空晚宴 5 日',
        date: '2026-02-18',
        img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=500&q=80',
        price: 'TWD 38,000',
        reviewed: false
      }
    ];
    localStorage.setItem(key, JSON.stringify(defaultActivities));
  }
}

window.openReviewModal = function(index) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  activeReviewActivityIndex = index;
  const key = `completed_activities_${currentUser}`;
  const activities = JSON.parse(localStorage.getItem(key) || '[]');
  const act = activities[index];

  if (!act) return;

  document.getElementById('review-tour-title').textContent = act.title;
  document.getElementById('review-date').value = act.date || new Date().toISOString().split('T')[0];
  document.getElementById('review-comment').value = '';
  document.getElementById('review-photo-input').value = '';
  document.getElementById('photo-preview-container').classList.add('hidden');
  uploadedPhotoBase64 = '';

  updateCharCount();
  setRating(5);
  document.getElementById('review-modal').style.display = 'flex';
};

window.closeReviewModal = function() {
  const modal = document.getElementById('review-modal');
  if (modal) modal.style.display = 'none';
};

window.setRating = function(rating) {
  currentRating = rating;
  const stars = document.querySelectorAll('#star-rating-container i');
  const text = document.getElementById('star-rating-text');

  stars.forEach((s, idx) => {
    if (idx < rating) {
      s.className = "fa-solid fa-star text-amber-400 cursor-pointer transition";
    } else {
      s.className = "fa-regular fa-star text-stone-300 cursor-pointer transition";
    }
  });

  const ratingLabels = ['1.0 分 (需要改善)', '2.0 分 (尚可)', '3.0 分 (普通)', '4.0 分 (滿意讚賞)', '5.0 分 (非常完美推薦)'];
  text.textContent = ratingLabels[rating - 1];
};

window.updateCharCount = function() {
  const comment = document.getElementById('review-comment').value;
  const countEl = document.getElementById('char-count');
  if (!countEl) return;

  const length = comment.length;
  if (length >= 30) {
    countEl.className = 'text-[11px] font-bold text-teal-600';
    countEl.textContent = `已達 ${length} 字 (符合贈券資格 🎉)`;
  } else {
    countEl.className = 'text-[11px] font-bold text-coral-600';
    countEl.textContent = `目前 ${length} 字 / 還差 ${30 - length} 字即可領券`;
  }
};

window.previewReviewPhoto = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedPhotoBase64 = e.target.result;
    document.getElementById('review-photo-img').src = uploadedPhotoBase64;
    document.getElementById('photo-preview-container').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
};

window.submitReview = function(event) {
  event.preventDefault();
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  const comment = document.getElementById('review-comment').value.trim();
  const date = document.getElementById('review-date').value;

  const key = `completed_activities_${currentUser}`;
  let activities = JSON.parse(localStorage.getItem(key) || '[]');
  const act = activities[activeReviewActivityIndex];

  if (!act) return;

  act.reviewed = true;
  act.reviewRating = currentRating;
  act.reviewComment = comment;
  act.reviewDate = date;

  if (uploadedPhotoBase64) {
    act.reviewPhoto = uploadedPhotoBase64;
    act.photo = uploadedPhotoBase64;
  }

  localStorage.setItem(key, JSON.stringify(activities));

  let giftCoupon = false;

  if (comment.length >= 30) {
    giftCoupon = true;
    const userCouponKey = `claimed_coupons_${currentUser}`;
    let claimed = JSON.parse(localStorage.getItem(userCouponKey) || '[]');
    if (!claimed.includes('btn-coupon-review')) {
      claimed.push('btn-coupon-review');
      localStorage.setItem(userCouponKey, JSON.stringify(claimed));
    }
  }

  if (currentRating >= 4) {
    const homeReviewsKey = 'homepage_reviews';
    let homeReviews = JSON.parse(localStorage.getItem(homeReviewsKey) || '[]');
    
    homeReviews.unshift({
      userName: currentUser,
      title: act.title,
      rating: currentRating,
      comment: comment || '這是一趟超乎期待的完美行程，專業導遊細心照顧！',
      date: date,
      photo: uploadedPhotoBase64 || act.img
    });

    localStorage.setItem(homeReviewsKey, JSON.stringify(homeReviews));
  }

  closeReviewModal();
  updateCouponBadge();

  if (typeof renderJournalPage === 'function') {
    renderJournalPage();
  }

  if (giftCoupon) {
    alert(`🎉 感謝您的深度評價（字數達 ${comment.length} 字）！\n已成功將【心得回饋 88 折優惠券】發放至您的「我的優惠券」帳戶！`);
  } else {
    alert(`🎉 感謝您的寶貴評價！\n(提示：心得滿 30 字即可自動獲得 88 折優惠券喔！)`);
  }
};

window.openCouponsModal = function() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert("請先登入會員以查看已領取的優惠券！");
    openAuthModal('login');
    return;
  }

  const couponsModal = document.getElementById('coupons-modal');
  const container = document.getElementById('coupons-list-container');
  if (!couponsModal || !container) return;

  const userCouponKey = `claimed_coupons_${currentUser}`;
  const claimedIds = JSON.parse(localStorage.getItem(userCouponKey) || '[]');

  const couponData = {
    'btn-coupon-1': { title: '早鳥專屬折價券', code: 'WANDER2026', desc: '全站預訂立減 NT$1,000', tag: '早鳥禮' },
    'btn-coupon-2': { title: 'VIP 95折優惠碼', code: 'VIP95OFF', desc: '全館行程皆可享 95 折', tag: 'VIP專屬' },
    'btn-coupon-3': { title: '日本上網卡免費券', code: 'JAPANSIM5D', desc: '免費兌換 5 日吃到飽網卡', tag: '好禮相送' },
    'btn-coupon-review': { title: '心得回饋 88 折優惠券', code: 'REVIEW88', desc: '感謝深度分享心得特別贈送', tag: '日誌獎勵' }
  };

  container.innerHTML = '';

  if (claimedIds.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-sm text-stone-400">目前尚無已領取的優惠券</div>`;
  } else {
    claimedIds.forEach(id => {
      const item = couponData[id];
      if (item) {
        container.innerHTML += `
          <div class="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div class="space-y-1">
              <span class="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${item.tag}</span>
              <h4 class="text-sm font-bold text-gray-800">${item.title}</h4>
              <p class="text-xs text-stone-500">${item.desc}</p>
              <div class="text-xs font-mono font-bold text-teal-700 bg-teal-100/80 px-2 py-1 rounded inline-block">代碼：${item.code}</div>
            </div>
            <button type="button" onclick="copyCouponCode('${item.code}')" class="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer flex-shrink-0">
              <i class="fa-regular fa-copy mr-1"></i>複製
            </button>
          </div>
        `;
      }
    });
  }

  couponsModal.style.display = 'flex';
};

window.copyCouponCode = function(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert(`成功複製折扣碼：${code}\n可以在結帳頁面直接貼上使用！`);
  });
};

window.logoutUser = function() {
  localStorage.removeItem('currentUser');
  location.reload();
};

window.claimCoupon = function(couponTitle, couponCode, buttonId) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert("🔒 請先登入會員才能領取專屬優惠券！");
    openAuthModal('login');
    return;
  }
  const btn = document.getElementById(buttonId);
  if (!btn || btn.disabled) return;
  
  btn.innerText = '已領取';
  btn.disabled = true;
  btn.className = 'px-3 py-1.5 bg-stone-200 text-stone-500 text-xs font-semibold rounded-lg cursor-not-allowed claimed';
  
  alert(`\n【${couponTitle}】\n優惠碼: ${couponCode}`);
  
  const userCouponKey = `claimed_coupons_${currentUser}`;
  let claimedIds = JSON.parse(localStorage.getItem(userCouponKey) || '[]');
  if (!claimedIds.includes(buttonId)) {
    claimedIds.push(buttonId);
    localStorage.setItem(userCouponKey, JSON.stringify(claimedIds));
  }

  updateCouponBadge();
};

function initClaimedCoupons() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  const userCouponKey = `claimed_coupons_${currentUser}`;
  let claimedIds = JSON.parse(localStorage.getItem(userCouponKey) || '[]');
  claimedIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.innerText = '已領取';
      btn.disabled = true;
      btn.className = 'px-3 py-1.5 bg-stone-200 text-stone-500 text-xs font-semibold rounded-lg cursor-not-allowed claimed';
    }
  });

  updateCouponBadge();
}