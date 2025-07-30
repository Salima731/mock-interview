import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../instance";

// ADD Event
export const addEvent = createAsyncThunk(
    "event/addEvent",
    async (newData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/events/create-event', newData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
);

// GET User's Events
export const getOwnEvent = createAsyncThunk(
    "event/getOwnEvent",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/events/user', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
);

// UPDATE Event
export const updateOwnEvent = createAsyncThunk(
    "event/updateOwnEvent",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/events/updateEvent/${id}`, updatedData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
);

// DELETE Event
export const deleteOwnEvent = createAsyncThunk(
    "event/deleteOwnEvent",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.delete(`/events/deleteEvent/${id}`, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
);

// ADMIN: Get All Events
export const getAllEvents = createAsyncThunk(
    "events/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get("/admin/events/all", {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
);

export const deleteEvents = createAsyncThunk(
    "admin/eventDelete",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.delete(`/admin/event/${id}`, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

// PUBLIC: Get All Public Events
export const getAllPublicEvents = createAsyncThunk(
    "events/getAllPublic",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get("/events/all");
            return data.events;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
);

export const getEventStats = createAsyncThunk(
    "event/getStats",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get("/admin/event-stats", {
                withCredentials: true,
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
);


// Event Slice
const eventSlice = createSlice({
    name: "event",
    initialState: {
        events: [],
        stats: {
            totalEvents: 0,
            eventsGrowth: [],
        },
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ADD Event
            .addCase(addEvent.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.events.push(action.payload.event);
            })
            .addCase(addEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // GET User's Events
            .addCase(getOwnEvent.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOwnEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.events;
            })
            .addCase(getOwnEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // UPDATE Event
            .addCase(updateOwnEvent.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOwnEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(e => e._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload.event;
                }
            })
            .addCase(updateOwnEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // DELETE own Event
            .addCase(deleteOwnEvent.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOwnEvent.fulfilled, (state, action) => {
                state.loading = false;
                const deletedEventId = action.payload.event._id;
                state.events = state.events.filter(ev => ev._id !== deletedEventId);
            })
            .addCase(deleteOwnEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // ADMIN: Get All Events
            .addCase(getAllEvents.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.events;
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //delete events
            .addCase(deleteEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const findEvent = state.events.findIndex((ev) => ev._id === action.payload.event._id);

                if (findEvent !== -1) {
                    state.events.splice(findEvent, 1);
                }
            })
            .addCase(deleteEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // PUBLIC: Get All Public Events
            .addCase(getAllPublicEvents.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPublicEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(getAllPublicEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //getEventSats
            .addCase(getEventStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEventStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats.totalEvents = action.payload.totalEvents;
                state.stats.eventsGrowth = action.payload.eventsGrowth;
            })
            .addCase(getEventStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    }
});

export default eventSlice.reducer;
