/* sw.js —— 离线缓存（Service Worker，classic 脚本，非 module）
 * 策略：
 *   - 导览请求（页面）：network-first，失败回退缓存 / ./index.html
 *   - vocabulary.json：network-first，保证新增单词立即可见，离线回退缓存
 *   - 其他同源 GET：stale-while-revalidate（先回缓存，同时后台更新）
 *
 * ⚠️ 每次发版都必须修改下面的 VERSION（日期＋流水号），
 *    否则 activate 不会清掉旧缓存，用户可能一直看到旧版本。
 * ⚠️ Service Worker 只在 http/https 下生效（file:// 不支持）。
 */
(function () {
  'use strict';

  var VERSION = 'vocab-test-2026-10-19.4';

  var PRECACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './vocabulary.json',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png'
  ];

  /* ---------- install：预缓存，单项失败不影响整体 ---------- */
  self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(VERSION).then(function (cache) {
        return Promise.all(PRECACHE.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' })).catch(function () {
            /* 缺少某个图标 / 资源时忽略，避免安装失败 */
          });
        }));
      }).then(function () {
        return self.skipWaiting();
      })
    );
  });

  /* ---------- activate：删除旧版本缓存 ---------- */
  self.addEventListener('activate', function (e) {
    e.waitUntil(
      caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k !== VERSION) return caches.delete(k);
          return null;
        }));
      }).then(function () {
        return self.clients.claim();
      })
    );
  });

  /* ---------- 工具函数 ---------- */
  function should_handle(req, url) {
    if (req.method !== 'GET') return false;
    if (url.origin !== self.location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return true;
  }

  function put(req, res) {
    if (!res || !res.ok || res.type !== 'basic') return;
    var copy = res.clone();
    caches.open(VERSION).then(function (c) {
      return c.put(req, copy);
    }).catch(function () { });
  }

  function offline_response() {
    return new Response('', { status: 504, statusText: 'Offline' });
  }

  /* ---------- network-first（页面 / vocabulary.json） ---------- */
  function network_first(req, fallback_url) {
    return fetch(req, { cache: 'no-store' }).then(function (res) {
      /* 5xx/404 等 HTTP 错误也当作离线处理，避免网关错误页盖掉缓存 */
      if (!res || !res.ok) throw new Error('HTTP ' + (res && res.status));
      put(req, res);
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (fallback_url) return caches.match(fallback_url);
        return null;
      }).then(function (res) {
        return res || offline_response();
      });
    });
  }

  /* ---------- stale-while-revalidate ---------- */
  function stale_while_revalidate(req) {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      var network = fetch(req, { cache: 'no-store' }).then(function (res) {
        put(req, res);
        return res;
      }).catch(function () {
        return null;
      });

      if (hit) {
        /* 不 await 网络：先回缓存，后台静默更新 */
        return hit;
      }
      return network.then(function (res) {
        return res || offline_response();
      });
    });
  }

  /* ---------- fetch 路由 ---------- */
  self.addEventListener('fetch', function (e) {
    var req = e.request;
    var url;
    try { url = new URL(req.url); } catch (err) { return; }
    if (!should_handle(req, url)) return;

    var is_navigate = req.mode === 'navigate' || req.destination === 'document';
    if (is_navigate) {
      e.respondWith(network_first(req, './index.html'));
      return;
    }

    if (url.pathname.slice(-'/vocabulary.json'.length) === '/vocabulary.json') {
      e.respondWith(network_first(req, './vocabulary.json'));
      return;
    }

    e.respondWith(stale_while_revalidate(req));
  });

  /* ---------- 让页面可主动要求接管新版 ---------- */
  self.addEventListener('message', function (e) {
    if (e.data === 'skip-waiting') self.skipWaiting();
  });
})();
