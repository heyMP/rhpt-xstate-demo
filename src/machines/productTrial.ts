import { createMachine, assign } from "xstate";
import { activateMachine, OnDoneData } from "./activate";

// Edit your machine(s) here
export const productTrialMachine =
createMachine({
  id: "Product Trial",
  initial: "Initializing",
  states: {
    Initializing: {
      on: {
        Initialized: [
          {
            target: "Activating",
            cond: "hasBypass",
            description: "- Offer has bypass\n- URL has bypass",
          },
          {
            target: "Loading",
          },
        ],
      },
    },
    Idle: {
      on: {
        requestActivation: {
          target: "Activating",
          cond: "hasSelectedOffer",
          description: "Clicking the 'Try it' button",
        },
        offerSelected: {
          description: "User selects offer from dropdown",
        },
        updatePlaceholder: {
          description: "Updates for Preview mode",
        },
      },
    },
    TrialSuccess: {
      on: {
        download: [
          {
            target: "TrialSuccess",
            cond: "successful",
            internal: false,
          },
          {
            target: "TrialSuccess",
            cond: "downloadError",
            internal: false,
          },
        ],
      },
    },
    Error: {
      type: "final",
    },
    TrialExpired: {
      type: "final",
    },
    TrialInProgress: {
      on: {
        "Event 1": {
          target: "Download",
        },
      },
      type: "final",
    },
    Loading: {
      invoke: {
        src: "SPA",
        id: "loadData",
        onDone: [
          {
            target: "Idle",
          },
        ],
        onError: [
          {
            target: "Error",
            description: "Failed AJAX request to fetch node",
          },
        ],
      },
    },
    Activating: {
      entry: "Authenticate",
      on: {
        activated: {
          target: "Trial Activated",
          cond: "Authenticated",
        },
        Login: {
          target: "Authenticate",
        },
        requestActivation: {
          target: "Error",
          cond: "AJAXError",
        },
      },
    },
    "Trial Activated": {
      on: {
        activate: [
          {
            target: "TrialSuccess",
            cond: "TrialSuccess",
          },
          {
            target: "TrialExpired",
            cond: "TrialExpired",
          },
          {
            target: "TrialInProgress",
            cond: "TrialInProgress",
          },
          {
            target: "OrgAdminPage",
            cond: "ErrorNoOrgAdmin",
          },
          {
            target: "IneligibilityPage",
            cond: "ErrorIneligible",
          },
          {
            target: "RequiresPartnerTerms",
            cond: "ErrorRequiresPartnerTerms",
          },
          {
            target: "ExportCompliance",
            cond: "ErrorExportCompliance",
          },
          {
            target: "CustomerService",
            cond: "ErrorCustomerService",
          },
          {
            target: "TrialSuccessRedirect",
            cond: "hasBypassSuccessRedirect",
          },
          {
            target: "Error",
            cond: "Error",
          },
        ],
      },
    },
    OrgAdminPage: {
      type: "final",
    },
    IneligibilityPage: {
      type: "final",
    },
    RequiresPartnerTerms: {
      type: "final",
    },
    ExportCompliance: {
      type: "final",
    },
    CustomerService: {
      type: "final",
    },
    TrialSuccessRedirect: {
      entry: "SuccessRedirect",
    },
    Authenticate: {
      invoke: {
        src: "Keycloak",
        id: "authenticate",
        onDone: [
          {
            target: "Activating",
          },
        ],
        onError: [
          {
            target: "Error",
          },
        ],
      },
      initial: "LoggedOut",
      states: {
        LoggedOut: {
          on: {
            login: {
              target: "Authenticated",
            },
          },
        },
        Authenticated: {
          on: {
            logout: {
              target: "LoggedOut",
            },
          },
        },
      },
      type: "parallel",
    },
    Download: {},
  },
  schema: {
    context: {} as {
      hasBypass: boolean;
      isAuthenticated: boolean;
      selectedOffer: string;
    },
    events: {} as
      | { type: "Initialized" }
      | { type: "requestActivation" }
      | { type: "offerSelected" }
      | { type: "updatePlaceholder" }
      | { type: "download" }
      | { type: "Event 1" }
      | { type: "activated" }
      | { type: "Login" }
      | { type: "activate" }
      | { type: "login" }
      | { type: "logout" },
  },
  context: {
    hasBypass: false,
    isAuthenticated: false,
    selectedOffer: null,
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    hasBypass: (context) => context.hasBypass,
    hasSelectedOffer: (context) => !!context.selectedOffer,
    isAuthenticated: (context) => !!context.isAuthenticated,
  },
});
