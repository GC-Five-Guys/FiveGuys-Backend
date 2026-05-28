import { User } from '../models/User';

export const createUser = async (userData: any) => {
    return await User.create(userData);
};
export const findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};
export const findUserByUsername = async (username: string) => {
    return await User.findOne({ username });
};
export const findUserById = async (id: string) => {
    return await User.findById(id).select('-password_hash');
};