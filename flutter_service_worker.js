'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "b54436fc6f966c501e37738051543c06",
"index.html": "8132e4910c043c345b3ee0c14602f7ff",
"/": "8132e4910c043c345b3ee0c14602f7ff",
"main.dart.js": "8cd54b3c7a777b154247359b8f79790f",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "332da2eba05691dcb04bf1d2a51070d4",
"assets/AssetManifest.json": "ce11e8e7be6d12909186cce16bd56083",
"assets/NOTICES": "4af15f6e9470b01b7432018bc653919a",
"assets/FontManifest.json": "5dd650155e9e9614271f0080fe4df6a8",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "b79c40c150f465c9d715af243b9ba13f",
"assets/assets/images/background/stats_background.webp": "244ff8c4da17b3bfaa2e47fa2ae913b6",
"assets/assets/images/background/error_background.webp": "14e7328f4040db8ab2aac4c828050c7b",
"assets/assets/images/background/background.webp": "2111295dccf8dfc565b47fb8229a1f1f",
"assets/assets/images/background/main_menu_background.webp": "d695e6da8ca4586eba11a25d428ed9fd",
"assets/assets/images/04-instruction.webp": "1e6b00744830e902d3002cb5b6573b9b",
"assets/assets/images/hungary.webp": "66dbfadca056919b115628421eadbc8f",
"assets/assets/images/boy/preview.webp": "5163fafbedf5be9c00c7d161adf6742a",
"assets/assets/images/boy/03-instruction-boy.webp": "025120be64cba527c8dbf000727b8c42",
"assets/assets/images/boy/02-instruction-boy.webp": "90ecafb36b38a9cc279917334a0c0aab",
"assets/assets/images/boy/01-instruction-boy.webp": "b97307e24a0041328a1edd36f5fd193e",
"assets/assets/images/sprite_map.png": "154919b565422f1e27b2c0b5a0d8d806",
"assets/assets/images/ukraine.webp": "18a00a978ae37c92f83739cbf27e409f",
"assets/assets/images/girl/preview.webp": "641686cd9965bca0a3d7f41a3ba98497",
"assets/assets/images/girl/02-instruction-girl.webp": "cf867cd4b4ad8cafc547e244ca3e677f",
"assets/assets/images/girl/01-instruction-girl.webp": "50628102fa20a660e560906184968cfc",
"assets/assets/images/girl/03-instruction-girl.webp": "b40c53e72f9c0df60371650de9717a10",
"assets/assets/images/england.webp": "f602b827d41dfc29fcff5e4d0bc01f24",
"assets/assets/images/key_down.svg": "fa16ccdd0770d5a97bec3b934092d7f1",
"assets/assets/images/error.svg": "a0dde2371e6b10b5b36b95a24ae8c063",
"assets/assets/images/cup.svg": "e1decb5dc261461107e64d78b2fa9cb4",
"assets/assets/images/key_up.svg": "ee8ad53a795b23ac12aa232933c64809",
"assets/assets/icons/AppIcons.ttf": "8adc58f58e3e055e2dab35dfe2ed0f8d",
"assets/assets/i18n/strings_hu.i18n.json": "f3b6578d247834000eff36a01c631358",
"assets/assets/i18n/strings_uk.i18n.json": "c03a3ee20e75fb5efc8a1f1c3798d9cb",
"assets/assets/i18n/strings_en.i18n.json": "581f989399e2496a331f19ad8b5130a2",
"assets/assets/fonts/RobotoMono-Regular.ttf": "7e173cf37bb8221ac504ceab2acfb195",
"assets/assets/fonts/RobotoMono-Bold.ttf": "0339b745f10bb01da181af1cdc33c361",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
