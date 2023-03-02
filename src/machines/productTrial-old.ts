import { createMachine, assign } from "xstate";
import { activateMachine, OnDoneData } from "./activate";

// Edit your machine(s) here
export const productTrialMachine =
  createMachine({
    context: { mockedType: undefined },
    tsTypes: {} as import("./productTrial-old.typegen").Typegen0,
    schema: {
      context: {
      } as {
        mockedType?: number
      },
      events: {} as
        | { type: "INITIALIZED" }
        | { type: "ACTIVATE" }
        | { type: "SUCCESS" }
        | { type: "IN_PROGRESS" }
        | { type: "EXPIRED" }
        | { type: "COMPLIANCE_ERROR" }
        | { type: "ERROR"; value: string },
      services: {} as
        | { 'activateService': { data: OnDoneData } }
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
            actions: [
              'assignMockType'
            ]
          },
        },
      },
      activate: {
        invoke: {
          src: 'activateService',
          data: {
            resType: (context, _) => context.mockedType
          },
          onDone: [
            { target: 'success', cond: 'isSuccess' },
            { target: 'in_progress', cond: 'isInProgress' },
            { target: 'compliance', cond: 'isComplianceError' },
            { target: 'expired', cond: 'isExpired' },
            { target: 'error', cond: 'isError' },
          ],
        },
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
      compliance: {
        type: 'final'
      },
      error: {
        type: "final",
      },
    },
  }, {
    guards: {
      isSuccess: (_, event) => {
        console.log('isSuccess');
        console.log(event);
        return event.data.resType.startsWith('2');
      },
      isInProgress: (_, event) => {
        console.log('isInProgress');
        return (event.data.resType === '409')
      },
      isExpired: (_, event) => {
        console.log('isExpired');
        return (event.data.resType.startsWith('4'))
      },
      isComplianceError: (_, event) => {
        console.log('isComplianceError');
        return (event.data.resType === '451')
      },
      isError: (_, event) => {
        console.log('isError');
        return event.data.resType.startsWith('5')
      },
    },
    services: {
      activateService: activateMachine
    },
    actions: {
      assignMockType: assign({ mockedType: (_ctx, event) => event.status })
    }
  });
