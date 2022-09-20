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
]

// Edit your machine(s) here
export const activateMachine =
	createMachine({
		context: {},
		tsTypes: {} as import("./activate.typegen").Typegen0,
		schema: {
			context: { } as {},
      events: { } as
        | { type: "200" }
        | { type: "400" }
        | { type: "401" }
        | { type: "403" }
        | { type: "404" }
        | { type: "422" }
        | { type: "451" }
        | { type: "500" }
		},
		id: 'activate',
		initial: 'activating',
		states: {
			activating: {
				on: {
          // add all of the response types as final events
          ...RESPONSE_TYPES.reduce((a,state) => ({ ...a, [state]: state}), {})
				},
			},
      // add all of the response types as final events
      ...RESPONSE_TYPES.reduce((a,state) => ({ ...a, [state]: { type: 'final' }}), {})
		},
	});
