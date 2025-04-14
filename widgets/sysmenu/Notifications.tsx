import { bind } from "astal";
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
        <box vertical className="Notifications section">
            <box vertical={false}>
                <button
                    onClick={() =>
                        notifications.set_dont_disturb(
                            !notifications.dontDisturb
                        )
                    }
                    className="icon"
                >
                    {bind(notifications, "dontDisturb").as((dnd) =>
                        dnd ? "󱏩" : "󰂚"
                    )}
                </button>
                <label>Notifications</label>
                <box hexpand={true} />
                <button onClick={clearNotifications}>Clear all</button>
            </box>
            <box vertical>
                {bind(notifications, "notifications").as((notifications) => {
                    if (notifications.length == 0) {
                        return <label className="none">All caught up</label>;
                    }

                    return notifications.map((notification) => {
                        return (
                            <Notification
                                onHoverLost={() => {}}
                                setup={() => {}}
                                notification={notification}
                            />
                        );
                    });
                })}
            </box>
        </box>
    );
}
