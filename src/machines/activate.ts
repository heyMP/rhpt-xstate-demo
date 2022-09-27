import { createMachine, assign } from "xstate";

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

const getHttpStatus = (statusCode = 200, sleep = 500) => { 
  return fetch(`https://httpstat.us/${statusCode ?? '200'}?sleep=${sleep}`).then((response) => response.status.toString()).catch((error) => error);
}

export type ResponseType = (typeof RESPONSE_TYPES)[number]

export type EventsObject = { type: ResponseType }

export type OnDoneData = { resType: ResponseType }

// Edit your machine(s) here
export const activateMachine =
  createMachine({
    tsTypes: {} as import("./activate.typegen").Typegen0,
    schema: {
      context: {} as { resType: ResponseType, sleep: Number },
      events: {} as EventsObject
    },
    id: 'activate',
    initial: 'activating',
    context: { resType: null },
    states: {
      activating: {
        invoke: {
          id: 'getHttpStatus',
          src: (context, _) => getHttpStatus(context.resType, context.sleep),
          onDone: {
            actions: 'updateResponseType',
          }
        },
        onDone: {
          target: 'doneActivating',
        }
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
      updateResponseType: assign({
        resType: (_, event) => {
          return event.data;
        }
      })
    }
  });
