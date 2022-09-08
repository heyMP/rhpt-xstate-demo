import { createMachine, interpret, assign } from "xstate";
import "./styles.css";

const updateApp = (count = '') => {
  document.getElementById("app").innerHTML = `
  <h1>XState TypeScript Example</h1>
  <div>
    Open the <strong>Console</strong> to view the machine output.
    The current count is ${count}
  </div>
  `;
}
updateApp()

// Edit your machine(s) here
const machine = createMachine({
  id: "machine",
  initial: "inactive",
  tsTypes: {} as import("./index.typegen").Typegen0,
  schema: {
    context: {} as { count: number },
    events: {} as { type: 'TOGGLE'; value: string } | { type: 'SHUTDOWN'; value: string }
  },
  context: {
    count: 0
  },
  states: {
    inactive: {
      on: { TOGGLE: "active", SHUTDOWN: "shutdown" }
    },
    active: {
      on: {
        TOGGLE: {
          target: "inactive",
          actions: ['increment']
        }, SHUTDOWN: "shutdown"
      }
    },
    shutdown: {
      type: 'final'
    }
  },
  {
    actions: {
      increment: assign((context, event) => {
        console.log('context', context.count + 1)
        return {
          count: context.count + 1
        }
      })
    }
  }
});

// Edit your service(s) here
const service = interpret(machine).onTransition((state) => {
  console.log(state.value);
  updateApp(state.context.count)
});

service.start();

service.send("TOGGLE");
service.send("TOGGLE");

