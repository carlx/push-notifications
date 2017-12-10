const webpush = require('web-push');
const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser');
const cors = require('cors');
server.use(middlewares);
server.use(bodyParser.json());
const faker = require('faker');

// VAPID keys should only be generated only once.
// const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  'BCbRoq5hANo5iwOz0SyrMEB2E2zuAiDbVb4N8so7l72RrE5KWScisBdiqbKOQZuDzp4ndUNkKTQrjM0g8SmasEw', // publicKey
  'iU0Z22AG6Sm-pFr4Ka94rrPBo1axCHV5QZ2Rx6bzeAI' // privateKey
);


// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/dJ3X-n2euaE:APA91bH2qgFFH-8QJbkPqov-zc1dLLUoSkkHBMriJUKhwl4ekGbLkxdl-QBVBjoICh2hczsB_7OnLbGD9tjW7rLl8-MQ5rsjPplyssxgGsCGMild5pxfTBQwOtwiJV8PEGUeyiPvk5b3',
  expirationTime: null,
  keys: {
    p256dh: 'BDCsEOhkNOjEy5-GpjcKgaQbUDJGX8sxl9MTQPjrHwTOo8ZvFfQPATvHF2a3ayG12RwCPATF_pPJhTKeqrw3XU4=',
    auth: 'qQR7tcrtYoEUKdke3APZVQ==',
  },
};

webpush.sendNotification(pushSubscription, 'Ello');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};


server.options('/notify', cors());
server.options('/invoice-app', cors());
server.options('/userdata', cors());
server.options('/employees', cors());
server.options('/schools/1', cors());


server.post('/notify', (req, res) => {
  res.status(200);
  const result = webpush.sendNotification(req.body, JSON.stringify({ title: faker.internet.email(), message: faker.company.companyName() }));
  res.jsonp(req.body);
  // res.jsonp(req.body.map(function (element) {
  //     element.state = 'CC';
  //     return element;
  // }));
});

// server.use(router)
server.listen(3066, () => {
  console.log('JSON Server is running on port: ', 3066);
});
