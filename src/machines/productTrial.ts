import { createMachine, interpret, assign, spawn, send } from "xstate";
import { activateMachine, ResponseType } from "./activate";

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
        | { type: "EXPIRED" }
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
          src: activateMachine,
          onDone: [
            { target: 'success', cond: 'isSuccess' },
            { target: 'in_progress', cond: 'isInProgress' },
            { target: 'expired', cond: 'isExpired' },
            { target: 'error', cond: 'isError' }
          ],
        },
        on: {
          SUCCESS: 'success',
          IN_PROGRESS: 'in_progress',
          EXPIRED: 'expired',
          ERROR: 'error'
        }
      },
      success: {
        type: "final",
      },
      in_progress: {
        type: "final",
      },
      expired: {
        type: "final",
      },
      error: {
        type: "final",
      },
    },
  }, {
    guards: {
      isSuccess: (_, event) => {
        return event?.data?.type?.startsWith('2');
      },
      isInProgress: (_, event) => {
        return (event?.data?.type === '409')
      },
      isExpired: (_, event) => {
        return (event?.data?.type.startsWith('4'))
      },
      isError: (_, event) => {
        return event?.data?.type.startsWith('5')
      },
    }
  });
