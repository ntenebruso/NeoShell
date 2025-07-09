import { createBinding, For } from "ags";
import Notifd from "gi://AstalNotifd";
import Notification from "../notifications/Notification";

export default function Notifications() {
    const notifications = Notifd.get_default();

    function clearNotifications() {
        notifications.notifications.forEach((notification) => {
            notification.dismiss();
        });
    }

    return (
        <box vertical class="Notifications section">
            <box vertical={false}>
                <button
                    onClick={() =>
                        notifications.set_dont_disturb(
                            !notifications.dontDisturb
                        )
                    }
                    class="icon"
                >
                    {createBinding(notifications, "dontDisturb")
                        .as((dnd) => (dnd ? "󱏩" : "󰂚"))
                        .get()}
                </button>
                <label label="Notifications"></label>
                <box hexpand={true} />
                <button onClick={clearNotifications}>Clear all</button>
            </box>
            <box vertical>
                <label
                    visible={
                        createBinding(notifications, "notifications").length ==
                        0
                    }
                    class="none"
                    label="All caught up"
                ></label>
                <For each={createBinding(notifications, "notifications")}>
                    {(notification: Notifd.Notification, index) => (
                        <Notification
                            onHoverLost={() => {}}
                            notification={notification}
                        />
                    )}
                </For>
            </box>
        </box>
    );
}
