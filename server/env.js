require("dotenv").config();
const { env } = process;

exports.PORT = parseInt(env.PORT || "3000", 10);
exports.KUBERNETES_HOST = env.KUBERNETES_HOST;
exports.KUBERNETES_NAMESPACE = env.KUBERNETES_NAMESPACE;
exports.KUBERNETES_SERVICE_ACCOUNT_TOKEN = env.KUBERNETES_SERVICE_ACCOUNT_TOKEN;
