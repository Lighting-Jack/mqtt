/**
 * mqtt-client封装
 * @author louiswu
 */
(function (win, doc) {
    ///////////////////////////////////
    ///////////// js-noop ////////////
    ////////////////////////////////
    function emptyFunction() { }

    ///////////////////////////////////
    /////////////  utils  ////////////
    ////////////////////////////////
    const utils = {
        // 首字母大写
        titleCase(string) {
            if (typeof string !== "string") throw Error("First arguments of titleCase must be String")
            const tmpS = string.toLowerCase(),
                length = tmpS.length;
            return length ? tmpS[0].toUpperCase() + tmpS.slice(1) : tmpS;
        },
        /**
         * 美化log
         * @param {*} cmd 命令
         * @param {*} modifier 修饰符
         * @param {*} ele 内容/值
         */
        log(cmd = "", modifier = "", ele) {
            const type = typeof ele;
            let jsonContent;
            if (type === "object") {
                jsonContent = ele;
                ele = ""
            } else {
                jsonContent = "";
                ele = ele || ""
            }
            console && console.log(`%c${this.titleCase(cmd)}%c${this.titleCase(modifier)}%c${ele}`, "background:grey;font:14px/20px '黑体';text-align:center;padding:0 10px;color:white;display:block;border-radius:40px 0 40px 0", "background:orange;border-radius:40px 0 40px 0;padding: 0 10px", "background:green;border-radius:40px 0 40px 0;padding: 0 10px;color:white", jsonContent)
        },
        /**
         * AOP系统
         * @param {*} target 切入点
         * @param {*} before 前置函数
         * @param {*} after 后置函数
         * 
         * @目前暂时没加入环绕函数
         */
        aopProxyMixin(target, before, after) {
            if (!typeof target === "function") throw Error("切入点必须为函数");
            const beforeFn = typeof before === "function" ? before : emptyFunction
            const afterFn = typeof after === "function" ? after : emptyFunction
            return function () {
                beforeFn(...arguments)
                target(...arguments)
                afterFn(...arguments)
            }
        }
    }

    ///////////////////////////////////
    ///////////// client  ////////////
    ////////////////////////////////
    var Client = function (opts) {
        // 常量
        const CLIENT_ID = "MqttClient"
        // 变量
        let topicList = [];
        // 配置
        var config = Object.assign({
            id: "clientId",
            host: "127.0.0.1",
            port: 1884,
            onConnectionLost(responseObject) {
                utils.log(CLIENT_ID, "connectLost", responseObject.errorMessage)
            },
            onMessageDelivered(message) {
                utils.log(CLIENT_ID, "messageDelivered", message.payloadString)
            },
            onMessageArrived(message) {
                utils.log(CLIENT_ID, "messageArrived", message.payloadString)
            }
        }, opts);
        // 初始化
        var client = new Paho.MQTT.Client(
            config.host,
            config.port,
            config.id
        );
        client.onConnectionLost = config.onConnectionLost
        client.onMessageDelivered = config.onMessageDelivered
        client.onMessageArrived = config.onMessageArrived
        // 建立连接
        client.connect({
            onSuccess: config.onConnect.bind(client) // 连接成功回调
        });

        ///////////////////////////////////
        /////////////  aop    ////////////
        ////////////////////////////////
        // 主题订阅
        client.subscribe = utils.aopProxyMixin(client.subscribe, (topic) => {
            utils.log(CLIENT_ID, "subscribe start", topic)
        }, (topic) => {
            topicList.push(topic)
            utils.log(CLIENT_ID, "subscribe end", topic)
        })

        this.topicList = topicList;
        this.client = client;
    }
    Client.prototype = {
        // 发送消息
        send(topic, msg, qos, retain, duplicate) {
            // 没订阅就先订阅
            if (this.topicList.indexOf(topic) === -1) {
                this.client.subscribe(topic);
            }
            const message = new Paho.MQTT.Message(msg);
            message.destinationName = topic;
            message.qos = 1;
            message.retained = retain || false
            message.duplicate = duplicate || false
            this.client.send(message);
        },
        // 订阅主题
        subscribe(topic) {
            this.client.subscribe(topic);
        }
    }

    window.utils = utils;
    window.MqttClient = Client
    new MqttClient({
        id: "louiswu", // clientName
        host: location.hostname, // wss连接host
        port: +1884, // wss连接端口
        onConnect() { // 连接成功回调
            utils.log("MqttClient", "connected", this)
        },
        // onConnectionLost() { // 连接断开回调
        //     utils.log("MqttClient", "connectLost")
        // },
        // onMessageArrived() { // 消息送达回调
        //     utils.log("MqttClient", "messageArrived")
        // },
    })
})(window, document)