import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // Explicitly load the environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  // Parse server port from environment variables
  const serverPort = parseInt(env.VITE_SERVER_PORT, 10) || 5173;

  return {
    plugins: [react()],
    base: "/",
    build: {
      chunkSizeWarningLimit: 3000,
    },
    resolve: {
      alias: {
        'react-big-calendar': 'react-big-calendar/lib',
      },
    },
    server: {
      port: serverPort, // Use the parsed port
    },
  };
});
