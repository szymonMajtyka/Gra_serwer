const WebSocket = require("ws");
console.log("Start");



const aWebSocketServer = new WebSocket.Server({port: 8888});
let aWebSocketPlayer;


aWebSocketServer.on("connection", (aWebSocketClient, req) =>{
    const ip = req.connection.remoteAddress;
    console.log(`Connected cliend from IP ${ip}`);

    if(!aWebSocketPlayer){
        aWebSocketPlayer = aWebSocketClient;

        aWebSocketPlayer.on("close", () => {
            console.log("Player disconnected");

            aWebSocketPlayer = null;
        })

        aWebSocketPlayer.on("message", (data) => {
            aWebSocketServer.clients.forEach((client) => {
                if(client != aWebSocketPlayer && WebSocket.OPEN === client.readyState){
                    client.send(data);
                }

            })
        })

        const akvData = {
            id: 1
        };

        aWebSocketClient.send(JSON.stringify(akvData));
    }
})



