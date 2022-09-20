import { createMachine, interpret, assign, spawn } from "xstate";
import { activateMachine } from "./activate";

// Edit your machine(s) here
export const productTrialMachine =
  createMachine({
    context: {},
    tsTypes: {} as import("./productTrial.typegen").Typegen0,
    schema: {
      context: {
      } as {},
      events: {} as
        | { type: "INITIALIZED" }
        | { type: "ACTIVATE" }
        | { type: "SUCCESS" }
        | { type: "IN_PROGRESS" }
        | { type: "ERROR"; value: string },
    },
    id: "productTrial",
    initial: "init",
    states: {
      init: {
        on: {
          INITIALIZED: {
            target: "try_it",
          },
        },
      },
      try_it: {
        on: {
          ACTIVATE: {
            target: "activate",
          },
        },
      },
      activate: {
        invoke: {
          id: 'activateActor',
          src: activateMachine
        },
        on: {
          SUCCESS: {
            target: "success",
          },
          IN_PROGRESS: {
            target: "in_progress",
          },
          ERROR: {
            target: "error",
          },
        },
      },
      success: {
        type: "final",
      },
      in_progress: {
        type: "final",
      },
      error: {
        type: "final",
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
