const koa = require("koa")
const serve = require("koa-static")
const fs = require('fs');
const router = require("koa-router")()
const path = require("path")

const app = new koa()

const config = {
    host: "127.0.0.1",
    port: 8080
}

function doReadFile(filePath) {
    fs.readFileSync(filePath, "utf-8", function (err, data) {
        if (err) {
            console.log(err)
        }
        console.log(data)
        return data;
    });
}

// router.get("/", (ctx, next) => {
//     next()
// })

// middleward
app.use(router.routes())
app.use(serve(path.join(__dirname, "../public")))

app.listen(config.port, (err) => {
    if (err) {
        console.error(JSON.stringify(err));
        return;
    }
    console.log("server has listened: " + config.port);
})