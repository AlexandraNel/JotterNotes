//this is my service worker file 
//this is how PWA can function offline
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies'); //added stalewhilerevalidate
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

//this automatically caches files that are part of the webpack build process- this enables quick offline loading
precacheAndRoute(self.__WB_MANIFEST);

// // Setup offline fallbacks
// offlineFallback({
//   pageFallback: '/offline.html',  // Fallback for navigation requests
//   imageFallback: '/images/offline.png',  // Fallback for image requests
// });

//cache strategy for pages = cache first ie. call cache before network called for response
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
     //this plugin will cache pages with specific http status ie. 200 (success)
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  //  this plugin in will set how long the ached fule will remain cached = here 30days 
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

//preloads certain URLs w pageCache strategy as soon as service worker is installed 
// they are immediately available prior to request
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

//using pageCache strategy we will cache pages that are navigated to 
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// 1- define strategy 2- register routes
// Set up asset cache
registerRoute(
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  // This is a caching strategy that immediately responds with a cached response (if available) 
  // while simultaneously fetching an updated version from the network in the background. 
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);