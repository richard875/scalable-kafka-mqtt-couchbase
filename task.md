- Ok cool. No stress on completion, its more to make your onboarding easier.

- Id suggest to use docker & compose to spin up a Kafka container and a kafka ui container (e.g. Kowl).
- Then try to send a message from node using kafka.JS
- Then, try to create a Couchbase container and explore the web ui

Note:

- NGINX: Bind port 80 and port 443 to the host

- if you can push a websocket update back to the client, you've replicated a big piece of our stack.
- for that, we use a protocol on top of websockets call MQTT.
- it's an IoT protocol, which is good for lightweight messages (e.g. price updates).
- for the client, we use a library called MQTT.js.
- for the server, we run a service called FlashMQ.
- we then use MQTT.js on the back-end to push messages to FlashMQ, and FlashMQ will route those messages to the client.

- try spinning up FlashMQ in a container, and then try to push a message to it using node.js. that's more than enough.
- other than that, try spinning up a Couchbase docker container, and try their web UI

## Port Lists

- ws://localhost:8081 (for MQTT from client)
- http://localhost:3000 (Betting Service Route)
- http://localhost:8091 (Couchbase Web UI)
- http://localhost:8080 (Kowl - Kafka UI)
