export declare const RegisterService: (userName: string, email: string, password: string, displayName: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/user.model.js").IUser, {}, {}> & import("../models/user.model.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const LoginService: (userName: string, password: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/user.model.js").IUser, {}, {}> & import("../models/user.model.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
//# sourceMappingURL=auth.service.d.ts.map