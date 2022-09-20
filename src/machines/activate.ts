import { createMachine, interpret, assign, send } from "xstate";

const RESPONSE_TYPES = [
  "200",
  "400",
  "401",
  "403",
  "404",
  "422",
  "451",
  "500"
] as const;

type ResponseType = (typeof RESPONSE_TYPES)[number]

type EventsObject = { type: ResponseType }

// Edit your machine(s) here
export const activateMachine =
  createMachine({
    tsTypes: {} as import("./activate.typegen").Typegen0,
    schema: {
      context: {} as {},
      events: {} as EventsObject
    },
    id: 'activate',
    initial: 'activating',
    states: {
      activating: {
        on: {
          // add all of the response types as final events
          ...RESPONSE_TYPES.reduce((a, state) => ({ ...a, [state]: { target: state } }), {})
        },
      },
      // add all of the response types as final events
      ...RESPONSE_TYPES.reduce((a, state) => ({ ...a, [state]: { type: 'final', data: { type: state } } }), {})
    },
  });
