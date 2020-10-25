# xterm.js for K8s/OCP Pod PoC

This is a proof-of-concept (PoC) attempt to communicate directly with Kubernetes/OpenShift Websocket, proxy the requests and expose it using `xterm.js` terminal emulator.

## Requirements

- NodeJS
- K8s environment (Minishift/Minikube)

## K8s/OCP Configuration

```bash
# Temporary alias if using K8s instead of OCP
[ -z "$(which oc)" ] && alias oc="kubectl"

# Define namespace/project name
KUBERNETES_NAMESPACE=xtermjs

# Create namespace
oc create ns $KUBERNETES_NAMESPACE

# Creates service account and assigns needs permissions
oc apply -n $KUBERNETES_NAMESPACE -f k8s/service-account.yml

# Create test Alpine deployment
oc apply -n $KUBERNETES_NAMESPACE -f k8s/alpine-deployment.yml

TOKEN_NAME=$(oc get secrets -n $KUBERNETES_NAMESPACE | grep terminal-account-token | head -n 1 | cut -d " " -f1)
KUBERNETES_SERVICE_ACCOUNT_TOKEN=$(oc describe secret $TOKEN_NAME -n $KUBERNETES_NAMESPACE | grep -o -E "ey.+")

# Get list of pods
oc get pods -n $KUBERNETES_NAMESPACE

# Create .env file and update API host
cp sample.env .env

# Append required config
cat <<EOF >> .env
KUBERNETES_NAMESPACE=$KUBERNETES_NAMESPACE
KUBERNETES_SERVICE_ACCOUNT_TOKEN=$KUBERNETES_SERVICE_ACCOUNT_TOKEN
EOF
```

## Server

```bash
# Install required dependencies
npm install

# Start PoC server
npm run serve

# Development mode where both frontend and backend code is being monitored and rebuilt on change
npm run dev
```

## References

- [xterm.js](https://xtermjs.org/)
- [kubernetes-client/javascript](https://github.com/kubernetes-client/javascript)
- [Kubernetes Container Terminal](https://github.com/kubernetes-ui/container-terminal)
- [Developing Start Kubernetes with React, TypeScript, and Skaffold](https://dev.to/peterj/developing-start-kubernetes-with-react-typescript-and-skaffold-4em7)
- [Executing commands in Pods using K8s API](https://www.openshift.com/blog/executing-commands-in-pods-using-k8s-api)
- [Use a WebSocket client to exec commands in a Kubernetes pod](https://jasonstitt.com/websocket-kubernetes-exec)
- [Token-based Header Authentication for WebSockets behind Node.js](https://yeti.co/blog/token-based-header-authentication-for-websockets-behind-nodejs/)
- [ws: a Node.js WebSocket library](https://github.com/websockets/ws)
- [How does 'kubectl exec' work?](https://erkanerol.github.io/post/how-kubectl-exec-works/)
- [Attacking and Defending Kubernetes: Bust-A-Kube – Episode 1](https://www.inguardians.com/attacking-and-defending-kubernetes-bust-a-kube-episode-1/)
- [Configure Service Accounts for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)
- [Writing WebSocket servers](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers)
- [How It Works — kubectl exec](https://itnext.io/how-it-works-kubectl-exec-e31325daa910)
