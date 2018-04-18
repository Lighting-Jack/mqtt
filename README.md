# Mqtt Demo
## 快速搭建
项目初始化
```
$ cd mqtt
$ npm i
```
启动webServer，监听8080端口
```
$ npm run server 
```
启动mqttServer，监听1884端口
```
$ npm run mqttServer 
```
打开浏览器，输入localhost:8080，可以看到服务正常启动。


## MqttClient
使用paho mqtt client，作为客户端mqtt-sdk
API文档：http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Message.html

在paho-mqtt-client基础上做了一点封装
### 实例化
```
new MqttClient({
    id: "xxx", // clientName
    host: location.hostname, // wss连接host
    port: +1884, // wss连接端口
    onConnect() { // 连接成功回调
       // do something
    },
    onConnectionLost() { // 连接断开回调
       // do something
    },
    onMessageArrived() { // 消息送达回调
       // do something
    }
})
```
### 属性
```
@property {array} topicList 客户端订阅的主题列表
@property {object} client 已经实例化的mqtt客户端
```
### 方法
```
@method {function} send 客户端发送信息
@method {function} subscribe 客户端订阅主题
```


## MqttServer
使用node-mosca搭建mqtt服务端
API文档：https://github.com/mcollina/mosca/wiki

