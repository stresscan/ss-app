console.log("SW Startup!");

// Install Service Worker
self.addEventListener("install", function(event) {
  console.log("installed!");
  event.waitUntil(self.skipWaiting());
});

// Service Worker Active
self.addEventListener("activate", function(event) {
  console.log("activated!");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", function(event) {
  console.log("SW Received Message: " + event.data);
  event.ports[0].postMessage("SW Says 'Hello back!'");
});

function send_message_to_client(client, msg) {
  return new Promise(function(resolve, reject) {
    var msg_chan = new MessageChannel();

    msg_chan.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    client.postMessage("SW Says: '" + msg + "'", [msg_chan.port2]);
  });
}

function send_message_to_all_clients(msg) {
  console.log({ clients });
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      send_message_to_client(client, msg).then(m =>
        console.log("SW Received Message: " + m)
      );
    });
  });
}
