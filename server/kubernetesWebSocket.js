const env = require("./env");
const WebSocket = require("ws");

exports.connect = (pod) => {
  podUrl = `wss://${env.KUBERNETES_HOST}/api/v1/namespaces/${env.KUBERNETES_NAMESPACE}/pods/${pod}/exec?command=sh&stdin=true&stdout=true&tty=true`;

  return new WebSocket(podUrl, {
    ws: true,
    headers: {
      Authorization: `Bearer ${env.KUBERNETES_SERVICE_ACCOUNT_TOKEN}`,
    },
    rejectUnauthorized: false,
  });
};

exports.stdin = (characters) => {
  return Buffer.from(`\x00${characters}`, "utf8");
};
