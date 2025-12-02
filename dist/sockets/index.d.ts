import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export { io, app, server };
//# sourceMappingURL=index.d.ts.map