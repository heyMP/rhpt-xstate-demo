import { createMachine, interpret, assign, send } from "xstate";

export const RESPONSE_TYPES = [
  '200',
  '400',
  '401',
  '403',
  '404',
  '409',
  '422',
  '451',
  '500'
] as const;

export type ResponseType = (typeof RESPONSE_TYPES)[number]

export type EventsObject = { type: ResponseType } 

export type OnDoneData = { resType: ResponseType }

// Edit your machine(s) here
export const activateMachine =
  createMachine({
    tsTypes: {} as import("./activate.typegen").Typegen0,
    schema: {
      context: {} as { resType: ResponseType },
      events: {} as EventsObject
    },
    id: 'activate',
    initial: 'activating',
    context: { resType: null },
    states: {
      activating: {
        on: {
          '200': { target: 'doneActivating', actions: 'updateResponseType' },
          '400': { target: 'doneActivating', actions: 'updateResponseType' },
          '401': { target: 'doneActivating', actions: 'updateResponseType' },
          '403': { target: 'doneActivating', actions: 'updateResponseType' },
          '404': { target: 'doneActivating', actions: 'updateResponseType' },
          '409': { target: 'doneActivating', actions: 'updateResponseType' },
          '422': { target: 'doneActivating', actions: 'updateResponseType' },
          '451': { target: 'doneActivating', actions: 'updateResponseType' },
          '500': { target: 'doneActivating', actions: 'updateResponseType' },
        },
      },
      doneActivating: {
        type: 'final',
        data: (context): OnDoneData => ({
          resType: context.resType
        })
      }
    },
  }, {
    actions: {
      updateResponseType: assign((_, event) => ({
        resType: event.type
      }))
    }
  });
