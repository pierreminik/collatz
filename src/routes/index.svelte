<script lang="ts">
  import "@carbon/charts/styles.min.css";
  import "carbon-components/css/carbon-components.min.css";
  import { LineChart } from "@carbon/charts-svelte";
  import { useMachine } from '@xstate/svelte';
  import collatzMachine from '$lib/machines/collatz';
  
  let number = 0;
  let outputs = [];
  let data = [];
  
  const { state, send } = useMachine(collatzMachine);
  
  $: send('INPUT', {
    data: number
  });
  
  $: if ($state.value === 'idle') { 
    data = [{
      group: `${$state.context.input}`,
      x: 0,
      y: $state.context.input
    }, ... $state.context.outputs.map((d, i) => {
      return {
        group: `${$state.context.input}`,
        x: i + 1,
        y: d
      };
    })];
  }
</script>

<input type="number" bind:value={number} />

<p>{$state.context.outputs.length}</p>

<LineChart
  data={data}
  options={{
  "title": "Collatz conjecture",
  "axes": {
    "bottom": {
      "title": "n",
      "mapsTo": "x",
      "scaleType": "linear"
    },
    "left": {
      "mapsTo": "y",
      "title": "Number",
      "scaleType": "linear"
    }
  },
  "curve": "curveLinear",
  "height": "600px"
  }}
  />