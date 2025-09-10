export type NavigationMenuItem = {
  path: string
  text: string
  i18n_key: string
  routeName: string
  icon: string
  showMode?: 'all' | 'authorized' | 'unauthorized'
}

export type NavigationMenu = Array<NavigationMenuItem>

export const mainMenu: NavigationMenu = [
  {
    path: '/',
    text: 'Home',
    i18n_key: 'home',
    routeName: 'Home',
    icon: '',
    showMode: 'all',
  },
  {
    path: '/todos',
    text: 'Todo list',
    i18n_key: 'todos',
    routeName: 'TodoList',
    icon: '',
    showMode: 'all',
  },
  {
    path: '/profile',
    text: 'Profile',
    i18n_key: 'profile',
    routeName: 'Profile',
    icon: '',
    showMode: 'authorized',
  },
  {
    path: '/notes',
    text: 'Notations',
    i18n_key: 'notations',
    routeName: 'Notes',
    icon: '',
    showMode: 'authorized',
  },
  {
    path: '/sign-in',
    text: 'Sign In',
    i18n_key: 'sign_in',
    routeName: 'SignIn',
    icon: '',
    showMode: 'unauthorized',
  },
  {
    path: '/sign-up',
    text: 'Sign Up',
    i18n_key: 'sign_up',
    routeName: 'SignUp',
    icon: '',
    showMode: 'unauthorized',
  },
  {
    path: '/resend-email-verification',
    text: 'Resend email verification',
    i18n_key: 'sign_up',
    routeName: 'ResendEmailVerification',
    icon: '',
    showMode: 'unauthorized',
  },
]

export const mapperMainMenu = {
  authorized: true,
  unauthorized: false,
}

export const byAuthorized =
  (isLogged: boolean) =>
  (menuItem: NavigationMenuItem): boolean => {
    const { showMode = 'all' } = menuItem
    if (showMode === 'all') return true
    return mapperMainMenu[showMode] === isLogged
  }
