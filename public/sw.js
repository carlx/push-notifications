

const applicationServerPublicKey = 'BCbRoq5hANo5iwOz0SyrMEB2E2zuAiDbVb4N8so7l72RrE5KWScisBdiqbKOQZuDzp4ndUNkKTQrjM0g8SmasEw';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener('push', (event) => {
  // console.log('[Service Worker] Push Received.');
  // console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = event.data.json().title;
  const options = {
    body: event.data.json().message,
    icon: 'icon.png',
    badge: 'badge.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  // console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://yoursite.pl')
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  // console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    }).then((newSubscription) => {
      /* TODO: Send the subscription object to application server.
            *       notifications are sent from the server using this object.
            */
      // console.log('[Service Worker] New subscription: ', newSubscription);
      // console.log(JSON.stringify(newSubscription));
    })
  );
});
