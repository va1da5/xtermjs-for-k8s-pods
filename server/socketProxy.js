const WebSocket = require("ws");
const url = require("url");
const { connect, stdin } = require("./kubernetesWebSocket");

const wssServer = new WebSocket.Server({
  noServer: true,
});

exports.setupSocket = (server) => {
  server.on("upgrade", (request, socket, head) => {
    let { pod } = url.parse(request.url, true).query;
    podSocket = connect(pod);
    wssServer.handleUpgrade(request, socket, head, (ws) => {
      wssServer.emit("connection", ws, podSocket);
    });
  });

  wssServer.on("connection", (ws, podSocket) => {
    podSocket.on("error", (error) => {
      console.log(error);
      ws.send(error.toString());
    });

    podSocket.on("close", () => {
      console.log("[!] k8s socket closed");
      wssServer.close();
    });

    ws.on("close", () => {
      closeShell = () => {
        const state = podSocket.readyState;
        if (state === 0) {
          return setTimeout(closeShell, 1000);
        }
        if (state === 2 || state === 3) {
          return;
        }
        // Exists current shell to prevent zombie processes
        podSocket.send(stdin("exit\n"));
        podSocket.close();
      };

      closeShell();
      console.log("[!] client connection closed");
    });

    podSocket.on("open", () => {
      podSocket.on("message", (data) => {
        ws.send(data.toString());
      });
      ws.on("message", (message) => {
        podSocket.send(stdin(message));
      });
    });
  });
};
