'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "219cf35316c9b141e54ce2c6771c3cb9",
"assets/AssetManifest.bin.json": "f359670c2357aa95657828addf893a47",
"assets/AssetManifest.json": "5888d2bff06526a48f581beb6769ffc7",
"assets/assets/img%2520(1).png": "ea8dadaeb2055e727c6211333cf75e0e",
"assets/assets/img%2520(10).png": "0307404b41c9d6aa29d6a661be01f169",
"assets/assets/img%2520(11).png": "274ec33a43dad8cd48a16b70b7dfc12c",
"assets/assets/img%2520(12).png": "a1c8283b023fe4a88d444869d33bf10a",
"assets/assets/img%2520(13).png": "85fe0c8ac2776f40981246a18eca623f",
"assets/assets/img%2520(14).png": "63181aef13db7e6fc7cb9bc5d64545b2",
"assets/assets/img%2520(15).png": "0b11c870af8bbec2240ce9c4463ff183",
"assets/assets/img%2520(16).png": "38f4fa64a3d746c4624c111e9a2cb73e",
"assets/assets/img%2520(17).png": "7a2c4f27989f7226994da1f69fe6b2f6",
"assets/assets/img%2520(18).png": "7d0530c854cbdb3e64d521e30df95292",
"assets/assets/img%2520(2).png": "76940897b5c70757a964f5c8e5201e4f",
"assets/assets/img%2520(3).png": "eea53a3c5e615505d927b8cafd11cd1c",
"assets/assets/img%2520(4).png": "ec9a4e7dd4ff216245314b4cb529182f",
"assets/assets/img%2520(5).png": "997ad3d27988a5abad8fd04b7b63408c",
"assets/assets/img%2520(6).png": "479aed2a30ae6c206528cc75e0bde6b7",
"assets/assets/img%2520(7).png": "4532859e32184b454081a549d17d72ea",
"assets/assets/img%2520(8).png": "c06c04b44e833877402f44aa518c2dd2",
"assets/assets/img%2520(9).png": "8a373701e4919db1f46d05f27e62902b",
"assets/FontManifest.json": "bfb5738640375970015fbb7083fa187b",
"assets/fonts/MaterialIcons-Regular.otf": "a3e0d65b41683d1cbd31b11af652e9c3",
"assets/NOTICES": "759c9a68393394a2fb8256ffc3c4c9d1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/packages/remixicon/fonts/Remix.ttf": "35ff0b36b529c4deb7c1f145d6e56062",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "32ec76651351edcd6258555d1089287c",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/icon-192.png": "af63066321102e35673e1e4c2c2764af",
"icons/icon-512.png": "e7e131ac152db1edf782714c567ee22f",
"icons/icon-maskable-192.png": "713df4cd4993a1b31903dfbb4b20198f",
"icons/icon-maskable-512.png": "1c2be7b48fddb2aa00d1f30eb726689c",
"index.html": "0996fd6c9022291e12bcb81d61ef16a6",
"/": "0996fd6c9022291e12bcb81d61ef16a6",
"main.dart.js": "4bcff3d36d5ff6d9e77a384061d269a5",
"manifest.json": "7db9db59da8cf0844b59b00671932a82",
"version.json": "744d72af39f86c5ea735192f241f0251"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
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
