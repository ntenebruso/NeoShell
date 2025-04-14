import { execAsync } from "astal";

export default function launchApp(name: string) {
    execAsync(`uwsm-app -- ${name}`).catch((error) => print(error));
}
