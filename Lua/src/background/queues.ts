import 'dotenv/config'
import Queues from "./lib/Queues";
Queues.process()
console.log('Queue is Running!')