import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../instance";



export const userRegister = createAsyncThunk(
    "user/userRegister",
    async (userRegisterData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post("/users/register", userRegisterData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const userLogin = createAsyncThunk(
    "user/userLogin",
    async (loginUserData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post("/users/login", loginUserData, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const userLogout = createAsyncThunk(
    "user/userLogout",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.post("/users/logout", null, {
                withCredentials: true
            });
            return data;

        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const getAllUsers = createAsyncThunk(  // admin
    "user/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get("admin/users/all", {
                withCredentials: true
            });
            return data;

        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const deleteUser = createAsyncThunk(   //admin
    "user/removeUser",
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await instance.delete(`/admin/user/${userId}`, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const userProfileUpdate = createAsyncThunk(
    "user/userEdit",
    async (upadatedUserData, { rejectWithValue }) => {
        try {
            const { data } = await instance.put("/users/profile-update", upadatedUserData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const userPasswordUpdate = createAsyncThunk(
    "user/updatePassword",
    async (resetData, { rejectWithValue }) => {
        try {
            const { data } = await instance.put("/users/update-password", resetData, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const updateUserRole = createAsyncThunk(   // admin
    "user/updateRole",
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const { data } = await instance.patch(`/admin/user/role/${id}`, { role }, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const updateUserStatus = createAsyncThunk(  //admin
    "user/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const { data } = await instance.patch(`/admin/user/status/${id}`, { status }, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const getUserStats = createAsyncThunk(
    "user/getUserStats",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get("/admin/user-stats", {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({
                message: error?.response?.data?.message || error?.message
            });
        }
    }
);


const usersSlice = createSlice({
    name: "usersSlice",
    initialState: {
        users: [],
        isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
        user: JSON.parse(localStorage.getItem("user")) || null,
        totalUsers: 0,
        usersGrowth: [],
        loading: false,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            //register
            .addCase(userRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users.push(action.payload.user);
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //userLogin
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("token", JSON.stringify(state.token));
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //userLogout
            .addCase(userLogout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogout.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isAuthenticated = false;
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("user")
            })
            .addCase(userLogout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //getAllUsers
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload.users;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //userDelete
            .addCase(deleteUser.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(deleteUser.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;

    // Use the ID we passed as arg instead of relying on response payload
    const userId = action.meta.arg; // the userId passed to deleteUser(userId)
    state.users = state.users.filter((user) => user._id !== userId);
})
.addCase(deleteUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload.message;
})

            //updateProfile
            .addCase(userProfileUpdate.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(userProfileUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(userProfileUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //updatePassword
            .addCase(userPasswordUpdate.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(userPasswordUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(userPasswordUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //updatedUserStatus
            // updatedUserStatus
.addCase(updateUserStatus.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(updateUserStatus.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;

    // Use action.meta.arg (id, status) to update instantly
    const { id, status } = action.meta.arg;
    const user = state.users.find((us) => us._id === id);
    if (user) {
        user.status = status;
    }
})
.addCase(updateUserStatus.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload.message;
})

// updateUserRole
.addCase(updateUserRole.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(updateUserRole.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;

    // Use action.meta.arg (id, role) to update instantly
    const { id, role } = action.meta.arg;
    const user = state.users.find((us) => us._id === id);
    if (user) {
        user.role = role;
    }
})
.addCase(updateUserRole.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload.message;
})


            //getUserStats
            .addCase(getUserStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserStats.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.totalUsers = action.payload.totalUsers;
                state.usersGrowth = action.payload.usersGrowth;
            })
            .addCase(getUserStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    }
})


export default usersSlice.reducer;