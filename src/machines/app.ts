import { createMachine, interpret, assign } from "xstate";
import { inspect } from "@xstate/inspect";
import { productTrialMachine } from "./productTrial";
import { toggleMachine } from "./toggle";
import { activateMachine } from "./activate";

inspect({
  iframe: false,
});

export const service = interpret(productTrialMachine, { devTools: true });

window.service = service;
