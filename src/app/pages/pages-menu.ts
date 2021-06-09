import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },

  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Organizations',
    icon: 'globe-2-outline',
    link: '/pages/organizations',
  },
  {
    title: 'Assets',
    icon: 'cube-outline',
    link: '/pages/assets',
  },
  {
    title: 'Areas',
    icon: 'pin-outline',
    link: '/pages/areas',
  },
  {
    title: 'Probes',
    icon: 'video-outline',
    link: '/pages/probes',
  },
  {
    title: 'Events',
    icon: 'maximize-outline',
    link: '/pages/events',
  },
  {
    title: 'Detected Attacks',
    icon: 'alert-circle-outline',
    link: '/pages/attacks/detected',
  },
  {
    title: 'Predicted Attacks',
    icon: 'eye-outline',
    link: '/pages/attacks/predicted',
  },
  {
    title: 'TLS Scans',
    icon: 'maximize-outline',
    link: '/pages/tls-scan',
  },
  {
    title: 'Risk Models',
    icon: 'unlock-outline',
    link: '/pages/audit',
  },
  {
    title: 'Risks Detected',
    icon: 'alert-triangle-outline',
    link: '/pages/risks',
  },
  {
    title: 'Compliance Reports',
    icon: 'file-text-outline',
    link: '/pages/compliance-reports',
  },
  {
    title: 'Transactions',
    icon: 'people-outline',
    link: '/pages/transactions',
  },
  {
    title: 'Vulnerabilities',
    icon: 'shield-outline',
    link: '/pages/vulnerabilities',
  },
  {
      title: 'Services',
      icon: 'collapse-outline',
      link: '/pages/services',
  },
  {
    title: 'Courses Of Action',
    icon: 'umbrella-outline',
    link: '/pages/course-of-actions',
  },
  {
    title: 'Regulations',
    icon: 'award-outline',
    link: '/pages/regulations',
  },
  {
    title: 'TTPs',
    icon: 'close-circle-outline',
    link: '/pages/ttps',
  },
  // {
  //     title: 'Layout',
  //     icon: 'layout-outline',
  //     children: [
  //         {
  //             title: 'Stepper',
  //             link: '/pages/layout/stepper',
  //         },
  //         {
  //             title: 'List',
  //             link: '/pages/layout/list',
  //         },
  //         {
  //             title: 'Infinite List',
  //             link: '/pages/layout/infinite-list',
  //         },
  //         {
  //             title: 'Accordion',
  //             link: '/pages/layout/accordion',
  //         },
  //         {
  //             title: 'Tabs',
  //             pathMatch: 'prefix',
  //             link: '/pages/layout/tabs',
  //         },
  //     ],
  // },
  // {
  //     title: 'Forms',
  //     icon: 'edit-2-outline',
  //     children: [
  //         {
  //             title: 'Form Inputs',
  //             link: '/pages/forms/inputs',
  //         },
  //         {
  //             title: 'Form Layouts',
  //             link: '/pages/forms/layouts',
  //         },
  //         {
  //             title: 'Buttons',
  //             link: '/pages/forms/buttons',
  //         },
  //         {
  //             title: 'Datepicker',
  //             link: '/pages/forms/datepicker',
  //         },
  //     ],
  // },
  // {
  //     title: 'UI Features',
  //     icon: 'keypad-outline',
  //     link: '/pages/ui-features',
  //     children: [
  //         {
  //             title: 'Grid',
  //             link: '/pages/ui-features/grid',
  //         },
  //         {
  //             title: 'Icons',
  //             link: '/pages/ui-features/icons',
  //         },
  //         {
  //             title: 'Typography',
  //             link: '/pages/ui-features/typography',
  //         },
  //         {
  //             title: 'Animated Searches',
  //             link: '/pages/ui-features/search-fields',
  //         },
  //     ],
  // },
  // {
  //     title: 'Modal & Overlays',
  //     icon: 'browser-outline',
  //     children: [
  //         {
  //             title: 'Dialog',
  //             link: '/pages/modal-overlays/dialog',
  //         },
  //         {
  //             title: 'Window',
  //             link: '/pages/modal-overlays/window',
  //         },
  //         {
  //             title: 'Popover',
  //             link: '/pages/modal-overlays/popover',
  //         },
  //         {
  //             title: 'Toastr',
  //             link: '/pages/modal-overlays/toastr',
  //         },
  //         {
  //             title: 'Tooltip',
  //             link: '/pages/modal-overlays/tooltip',
  //         },
  //     ],
  // },
  // {
  //     title: 'Extra Components',
  //     icon: 'message-circle-outline',
  //     children: [
  //         {
  //             title: 'Calendar',
  //             link: '/pages/extra-components/calendar',
  //         },
  //         {
  //             title: 'Progress Bar',
  //             link: '/pages/extra-components/progress-bar',
  //         },
  //         {
  //             title: 'Spinner',
  //             link: '/pages/extra-components/spinner',
  //         },
  //         {
  //             title: 'Alert',
  //             link: '/pages/extra-components/alert',
  //         },
  //         {
  //             title: 'Calendar Kit',
  //             link: '/pages/extra-components/calendar-kit',
  //         },
  //         {
  //             title: 'Chat',
  //             link: '/pages/extra-components/chat',
  //         },
  //     ],
  // },
  // {
  //     title: 'Maps',
  //     icon: 'map-outline',
  //     children: [
  //         {
  //             title: 'Google Maps',
  //             link: '/pages/maps/gmaps',
  //         },
  //         {
  //             title: 'Leaflet Maps',
  //             link: '/pages/maps/leaflet',
  //         },
  //         {
  //             title: 'Bubble Maps',
  //             link: '/pages/maps/bubble',
  //         },
  //         {
  //             title: 'Search Maps',
  //             link: '/pages/maps/searchmap',
  //         },
  //     ],
  // },
  // {
  //     title: 'Charts',
  //     icon: 'pie-chart-outline',
  //     children: [
  //         {
  //             title: 'Echarts',
  //             link: '/pages/charts/echarts',
  //         },
  //         {
  //             title: 'Total Vulnerabilities',
  //             link: '/pages/charts/assets'
  //         },
  //         {
  //             title: 'Charts.js',
  //             link: '/pages/charts/chartjs',
  //         },
  //         {
  //             title: 'D3',
  //             link: '/pages/charts/d3',
  //         },
  //     ],
  // },
  // {
  //     title: 'Editors',
  //     icon: 'text-outline',
  //     children: [
  //         {
  //             title: 'TinyMCE',
  //             link: '/pages/editors/tinymce',
  //         },
  //         {
  //             title: 'CKEditor',
  //             link: '/pages/editors/ckeditor',
  //         },
  //     ],
  // },
  // {
  //     title: 'Tables & Data',
  //     icon: 'grid-outline',
  //     children: [
  //         {
  //             title: 'Smart Table',
  //             link: '/pages/tables/smart-table',
  //         },
  //         {
  //             title: 'Tree Grid',
  //             link: '/pages/tables/tree-grid',
  //         },
  //     ],
  // },
  // {
  //     title: 'Miscellaneous',
  //     icon: 'shuffle-2-outline',
  //     children: [
  //         {
  //             title: '404',
  //             link: '/pages/miscellaneous/404',
  //         },
  //     ],
  // },
  // {
  //     title: 'Auth',
  //     icon: 'lock-outline',
  //     children: [
  //         {
  //             title: 'Login',
  //             link: '/auth/login',
  //         },
  //         {
  //             title: 'Register',
  //             link: '/auth/register',
  //         },
  //         {
  //             title: 'Request Password',
  //             link: '/auth/request-password',
  //         },
  //         {
  //             title: 'Reset Password',
  //             link: '/auth/reset-password',
  //         },
  //     ],
  // },
];
