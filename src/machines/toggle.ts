import { Machine } from "xstate";

interface ToggleContext {
  count: number;
}

export const toggleMachine = Machine<ToggleContext>({
  id: "toggle",
  initial: "inactive",
  context: {
    count: 0
  },
  states: {
    inactive: {
      on: { TOGGLE: "active" }
    },
    active: {
      on: { TOGGLE: "inactive" }
    }
  }
});
