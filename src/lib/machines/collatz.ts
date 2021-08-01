import { assign, createMachine } from 'xstate';

export interface machineContext {
  input?: number;
  current?: number;
  outputs: number[];
  errorMessage?: string;
}

export type machineEvent = 
| {
  type: 'INPUT';
  data: number;
} | {
  type: 'SOMEHTING';
  data: number;
};

const collatzMachine = createMachine<
  machineContext,
  machineEvent
>({
  id: 'collatz',
  initial: 'idle',
  context: {
    outputs: []
  },
  states: {
    idle: {
      on: {
        INPUT: {
          target: 'debounce',
          actions: ['assignInputToContext'],
        },
      },
    },
    debounce: {
      on: {
        INPUT: {
          target: 'debounce',
          actions: ['assignInputToContext'],
        },
      },
      after: {
        300: {
          target: 'calculate'
        }
      }
    },
    calculate: {
      invoke: {
        src: 'calculate',
        onDone: {
          target: 'check',
          actions: ['assignOutputsToContext', 'clearErrorMessage']
        },
        onError: {
          target: 'idle',
          actions: 'assignErrorMessageToContext',
        },
      },
    },
    check: {
      invoke: {
        src: 'check',
        onDone: {
          target: 'idle'
        },
        onError: {
          target: 'calculate'
        }
      }
    }
  },
},
{
  services: {
    calculate: (context) => new Promise((resolve, reject) => {
      if (context.current < 1) {
        reject(`${context.input} is not a positive integer`);
      }
      
      if ((context.current % 2) == 1) {
        resolve((context.current * 3) + 1);
      } else {
        resolve(context.current / 2);
      }
    }),
    check: (context) => new Promise((resolve, reject) => {
      if (context.current === 1) {
        resolve({});
      } else {
        reject();
      }
    })
  },
  actions: {
    assignInputToContext: assign((context, event) => {
      if (event.type !== 'INPUT') return {};
      return {
        input: event.data,
        current: event.data,
        outputs: []
      };
    }),
    assignOutputsToContext: assign((context, event) => {
      context.outputs.push(event.data);
      context.current = event.data;
      
      return context;
    }),
    assignErrorMessageToContext: assign((context, event: any) => {
      return {
        errorMessage: event.data?.message || 'An unknown error occurred',
      };
    }),
    clearErrorMessage: assign({
      errorMessage: undefined,
    }),
  }
});

export default collatzMachine;
