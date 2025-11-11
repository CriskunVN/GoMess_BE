export declare const RegisterService: (username: string, email: string, password: string, displayName: string) => Promise<import("mongoose").Document<unknown, {}, import("../types/type.js").IUser, {}, {}> & import("../types/type.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const LoginService: (username: string, password: string) => Promise<import("mongoose").Document<unknown, {}, import("../types/type.js").IUser, {}, {}> & import("../types/type.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
//# sourceMappingURL=auth.service.d.ts.map