// Import the createApp function from Vue to initialize the application
import { createApp } from 'vue';
import {createPinia} from 'pinia';
import { definePreset } from '@primeuix/themes'
import { initDarkMode } from './app/plugins/darkMode'

// Import the global CSS styles for the application
import './style.css';

// Import the root App component
import App from './App.vue';

// Import PrimeVue configuration for UI components
import PrimeVue from 'primevue/config';

// Import the Aura theme for PrimeVue components
import Aura from '@primeuix/themes/aura';

// Import the Vue router for client-side routing
import router from './app/router';

// Import PrimeVue ToastService for displaying notifications
import ToastService from 'primevue/toastservice';

// Import the PrimeVue Toast component for rendering toast notifications
import Toast from 'primevue/toast';

// Import PrimeVue ConfirmationService for confirmation dialogs
import ConfirmationService from 'primevue/confirmationservice';

// Import PrimeVue Ripple directive for adding ripple effects to components
import Ripple from 'primevue/ripple';

import Tooltip from 'primevue/tooltip';

// Create the Vue application instance
const app = createApp(App);
app.use(createPinia());



const MyPreset = definePreset(Aura, {
  semantic: {

    // اللون الأساسي للنظام
    primary: {
      50: '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '{orange.500}',
      600: '{orange.600}',
      700: '{orange.700}',
      800: '{orange.800}',
      900: '{orange.900}',
      950: '{orange.950}'
    },

    // ألوان الخلفيات (Light & Dark)
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db'
        }
      },
      dark: {
        surface: {
          0: '#121212',
          50: '#1e1e1e',
          100: '#2a2a2a',
          200: '#333333',
          300: '#3d3d3d'
        }
      }
    }
  }
})



// Configure PrimeVue with the Aura theme
app.use(PrimeVue, {
  ripple: true,
  rtl: true,
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark-mode',
    }
  },
});
initDarkMode()


// Register the ToastService for displaying toast notifications
app.use(ToastService);
app.directive('tooltip', Tooltip);


// Register the Toast component globally
app.component('Toast', Toast);

// Register the ConfirmationService for confirmation dialogs
app.use(ConfirmationService);

// Register the Ripple directive for adding ripple effects to interactive elements
app.directive('ripple', Ripple);

// Register the Vue router for client-side navigation
app.use(router);

// Mount the application to the DOM element with ID 'app'
app.mount('#app');