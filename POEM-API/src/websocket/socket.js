// 引入nodejs-websocket
const ws = require('nodejs-websocket');
const ip = require('ip')
const host = '127.0.0.1',
    port = process.env.SocketPORT;
const DB = require("../db");
const jwt = require("jsonwebtoken");
const config = require("../config");
// 创建ws服务
ws.createServer((socket) => {
    let payload = null;
    // try {
    //     const authorizationHeader = req.get("Authorization");
    //     const accessToken = authorizationHeader;
    //     payload = jwt.verify(accessToken, config.jwtSecret);
    // } catch (error) {
    //     return res.status(401).json({
    //         code: 401,
    //         message: "TOKEN 已过期",
    //     });
    // }
    // console.log(socket)
    // 定义测试数据
    // const data = ['日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。', '清明时节雨纷纷，路上行人欲断魂。借问酒家何处有？牧童遥指杏花村。', '春种一粒粟，秋收万颗子。四海无闲田，农夫犹饿死。'];
    socket.on('login', ({userId,username}) => {
        console.log(userId,username)
        // 当收到消息的时候就开始定时推送
        // console.log('message', message);
        // setInterval(() => {
        //     // 随机推送message里的内容
        //     conn.sendText(data[(Math.random() * 2).toFixed(0)]);
        // socket.sendText(data[0]);
        // // }, 5 * 1000);
        // socket.on("disconnect", () => {
        //     // 用户掉线或离开,将用户从服务器用户列表删除
        //     // userLevelRoom(id);
        //     // // 给该房间内用户推送房前房间内所有用户列表
        //     // socket.leave(room);
        //     // io.in(room).emit("getusers", getRoomUser(room));
        //   });
    });
}).listen(port, host, () => {
    console.info(`Socket.io 启动成功，运行端口：${port} http://${ip.address()}:${port}`);
});
