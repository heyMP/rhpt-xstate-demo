// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "logIt";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    logIt: "TOGGLE";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "active" | "inactive" | "shutdown";
  tags: never;
}
