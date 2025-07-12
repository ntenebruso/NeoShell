import { createState } from "ags";

// Idle inhibitor
const [idleInhibit, setIdleInhibit] = createState(false);

export { idleInhibit, setIdleInhibit };
