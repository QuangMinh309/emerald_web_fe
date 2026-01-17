import { createSlice } from "@reduxjs/toolkit";
import type { SystemUserNotification } from "@/types/system-notification";
interface NotificationState {
  items: SystemUserNotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification(state, action) {
      state.items.unshift(action.payload);
      state.unreadCount++;
    },

    markAllRead(state) {
      state.unreadCount = 0;
      state.items.forEach((n) => (n.isRead = true));
    },
  },
});

export const { markAllRead, pushNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
