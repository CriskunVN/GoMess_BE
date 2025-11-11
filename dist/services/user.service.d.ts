export declare const getUserById: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("../types/type.js").IUser, {}, {}> & import("../types/type.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const getAllUsers: () => Promise<(import("mongoose").Document<unknown, {}, import("../types/type.js").IUser, {}, {}> & import("../types/type.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const updateUser: (id: string, updateData: any) => Promise<import("mongoose").Document<unknown, {}, import("../types/type.js").IUser, {}, {}> & import("../types/type.js").IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const deleteUser: (id: string) => Promise<void>;
//# sourceMappingURL=user.service.d.ts.map