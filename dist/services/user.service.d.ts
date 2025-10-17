export declare const getUserById: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/user.model.js").IUser, {}, {}> & import("../models/user.model.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const getAllUsers: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/user.model.js").IUser, {}, {}> & import("../models/user.model.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const updateUser: (id: string, updateData: any) => Promise<import("mongoose").Document<unknown, {}, import("../models/user.model.js").IUser, {}, {}> & import("../models/user.model.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const deleteUser: (id: string) => Promise<void>;
//# sourceMappingURL=user.service.d.ts.map