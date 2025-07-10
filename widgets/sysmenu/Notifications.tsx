import { createBinding, For, With } from "ags";
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
                    label={createBinding(notifications, "dontDisturb").as(
                        (dnd) => (dnd ? "󱏩" : "󰂚")
                    )}
                ></button>
                <label label="Notifications"></label>
                <box hexpand={true} />
                <button onClick={clearNotifications}>Clear all</button>
            </box>
            <box vertical>
                <With value={createBinding(notifications, "notifications")}>
                    {(notifications: Notifd.Notification[]) => {
                        if (notifications.length == 0) {
                            return (
                                <label
                                    class="none"
                                    label="All caught up"
                                ></label>
                            );
                        }

                        return (
                            <box vertical>
                                {notifications.map((notification) => (
                                    <Notification
                                        onHoverLost={() => {}}
                                        notification={notification}
                                    />
                                ))}
                            </box>
                        );
                    }}
                </With>
            </box>
        </box>
    );
}
