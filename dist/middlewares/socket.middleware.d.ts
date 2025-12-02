import type { Socket } from "socket.io";
type SocketNextFunction = (err?: Error) => void;
export declare const socketAuthMiddleware: (socket: Socket, next: SocketNextFunction) => Promise<void>;
export {};
//# sourceMappingURL=socket.middleware.d.ts.map