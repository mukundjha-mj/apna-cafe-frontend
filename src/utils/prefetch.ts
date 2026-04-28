/**
 * Utility to prefetch lazy components
 */
export const prefetchPage = (pageName: string) => {
  switch (pageName) {
    case 'Menu':
      import('../pages/Menu');
      break;
    case 'Cart':
      import('../pages/Cart');
      break;
    case 'Profile':
      import('../pages/Profile');
      break;
    case 'Orders':
      import('../pages/Orders');
      break;
    case 'Wallet':
      import('../pages/Wallet');
      break;
    case 'Search':
      import('../pages/Search');
      break;
  }
};
