// インストール時の処理
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

// 有効化時の処理
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(clients.claim());
});

// 通信に割り込む処理（PWAの必須要件をクリアするためだけの空処理）
self.addEventListener('fetch', (event) => {
    // 今回はキャッシュなどを使わず、そのままネットワーク通信を通す
});
