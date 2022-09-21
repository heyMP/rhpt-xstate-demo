import { createMachine, interpret, assign } from "xstate";
import { inspect } from "@xstate/inspect";
import { productTrialMachine } from "./productTrial";
import { toggleMachine } from "./toggle";
import { activateMachine } from "./activate";

inspect({
  iframe: false,
});

export const productTrialService = interpret(productTrialMachine, { devTools: true });

window.productTrialService = productTrialService;
