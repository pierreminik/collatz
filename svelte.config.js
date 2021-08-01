import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

const production = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
    adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
    vite: {
      optimizeDeps: {
        include: ['@carbon/charts']
      },
      ssr: {
        noExternal: [production && '@carbon/charts'].filter(Boolean),
      }
    }
	}
};

export default config;
