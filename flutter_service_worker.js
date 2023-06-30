'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "31df162b6d1f691a5d1dea812748e93d",
"assets/assets/animations/321.riv": "74f4b3458e6d47c9808f690f43339b19",
"assets/assets/fonts/ProbaPro-Regular.ttf": "713b92c2783a804969aa746f7b38aa0e",
"assets/assets/fonts/ProbaPro-SemiBold.ttf": "d80fe7993a2fa23acc73fa27df0a1ed6",
"assets/assets/icons/AppIcons.ttf": "56e142bbd0ee9644d45af8b896910cac",
"assets/assets/images/england.webp": "c84c15241c46e17510506ce781019694",
"assets/assets/images/error.webp": "af2b2b730090d255e88cc6a1d6fa40c2",
"assets/assets/images/hungary.webp": "1723796a24e3a1113b5346d510256f4f",
"assets/assets/images/instruction_step_1_en.webp": "3b613ecebee10f02f0500a31343332a9",
"assets/assets/images/instruction_step_1_hu.webp": "abc18cb6e60c02cf7bceb11151157168",
"assets/assets/images/instruction_step_1_ua.webp": "fcc5e858c56f3485c2d7cb57f084aecb",
"assets/assets/images/instruction_step_2_en.webp": "c102e10402059ce9db7767db849f8d5e",
"assets/assets/images/instruction_step_2_hu.webp": "935cec709474e360edf21ff7a74cec62",
"assets/assets/images/instruction_step_2_ua.webp": "9f0d420d30a3dd712a601dcfd1251104",
"assets/assets/images/instruction_step_3_en.webp": "41583345644c71cc75d0b7714753af06",
"assets/assets/images/instruction_step_3_hu.webp": "17861aa15332dcc805f4d3865daf6d15",
"assets/assets/images/instruction_step_3_ua.webp": "9e5cf8c987e5ee4295f47350fd1cd778",
"assets/assets/images/instruction_step_4_en.webp": "d08528cab67aad495792e7ec68ec97e1",
"assets/assets/images/instruction_step_4_hu.webp": "e7ad2f49503d698ac76708d7a72e63bf",
"assets/assets/images/instruction_step_4_ua.webp": "f21d96fd79d8c9646c45e7d3ccc0e77d",
"assets/assets/images/ukraine.webp": "bb4d0cd8aa221056f8b0babd33c457be",
"assets/assets/translations/en.json": "edd6e62de7a9286f8d2d9359ec2d0d92",
"assets/assets/translations/hu.json": "4e0b74a16a2fd2117afb719c58111fc8",
"assets/assets/translations/uk.json": "42043d1f3e550d3063862154aecc3448",
"assets/FontManifest.json": "36730eb1cef5c3cdac136f349f49d61c",
"assets/NOTICES": "abc6256728248687b0724111404680a1",
"assets/packages/easy_localization/i18n/ar-DZ.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/ar.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/en-US.json": "5f5fda8715e8bf5116f77f469c5cf493",
"assets/packages/easy_localization/i18n/en.json": "5f5fda8715e8bf5116f77f469c5cf493",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "5343702ef5c16085dd9d3c7872749aaa",
"/": "5343702ef5c16085dd9d3c7872749aaa",
"main.dart.js": "2da289f19c768fb0562ae243eee43bb7",
"manifest.json": "7e201ec5eea6cc1d318e4b730759c174",
"version.json": "a8667e8c038d4a2799575ecd4d30fea8"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
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
