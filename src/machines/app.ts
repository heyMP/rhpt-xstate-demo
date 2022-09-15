import { createMachine, interpret, assign } from "xstate";

// Edit your machine(s) here
const machine = createMachine({
  id: "machine",
  initial: "init",
  tsTypes: {} as import("./app.typegen").Typegen0,
  schema: {
    context: {} as {},
    events: {} as { type: 'INITIALIZED'; value: string }
      | { type: 'ACTIVATE'; value: string }
      | { type: 'SUCCESS'; value: string }
      | { type: 'IN_PROGRESS'; value: string }
      | { type: 'ERROR'; value: string }
  },
  context: {
  },
  states: {
    init: {
      on: { INITIALIZED: "try_it" }
    },
    try_it: {
      on: {
        ACTIVATE: "activate"
      }
    },
    activate: {
      on: {
        SUCCESS: "success",
        IN_PROGRESS: "in_progress",
        ERROR: "error"
      }
    },
    success: {
      type: 'final'
    },
    in_progress: {
      type: 'final'
    },
    error: {
      type: 'final'
    },
  },
}, {
    actions: {
      // increment: assign((context, event) => {
      //   return {
      //     count: context.count + 1
      //   }
      // })
    }
  });

// Edit your service(s) here
export const service = interpret(machine);

// service.start();
