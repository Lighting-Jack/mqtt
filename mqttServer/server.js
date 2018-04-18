var mosca = require('mosca')


var settings = {
    http: {
        port: 1884,
        bundle: true
    }
};

//here we start mosca
var server = new mosca.Server(settings);
server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}

// fired whena  client is connected
server.on('clientConnected', function (client) {
    console.log('client connected', client.id);
    server.subscribe

});


// fired when a message is received
server.on('published', function (packet, client) {
    console.log("receive", packet)
    if (packet.qos !== 1) return;
    var message = {
        topic: packet.topic,
        payload: `<来自server>恭喜${client.id}，server已经收到信息`, // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false, // or true
    };

    server.publish(message, function () {
        console.log('done!');
    });
});

// fired when a client subscribes to a topic
server.on('subscribed', function (topic, client) {
    console.log('subscribed : ', topic);
    var message = {
        topic: topic,
        payload: `<来自server>恭喜${client.id}，你已经成功订阅主题${topic}`, // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    server.publish(message, function () {
        console.log('done!');
    });
});

// fired when a client subscribes to a topic
server.on('unsubscribed', function (topic, client) {
    console.log('unsubscribed : ', topic);
});

// fired when a client is disconnecting
server.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting : ', client.id);
});

// fired when a client is disconnected
server.on('clientDisconnected', function (client) {
    console.log('clientDisconnected : ', client.id);
});