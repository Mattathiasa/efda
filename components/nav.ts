export interface NavItem {
  /** key in the `common` namespace */
  key: 'navAbout' | 'navPrograms' | 'navProjects' | 'navStory' | 'navContact';
  href: string;
}

/* The five header links. Programs and Our story are anchors on Home, so from
   any other page they point back at the home route. */
export const navItems: NavItem[] = [
  {key: 'navAbout', href: '/about'},
  {key: 'navPrograms', href: '/#programs'},
  {key: 'navProjects', href: '/projects'},
  {key: 'navStory', href: '/#story'},
  {key: 'navContact', href: '/contact'}
];

/* The mobile menu drops "Our story", as the design does. */
export const mobileNavItems: NavItem[] = navItems.filter((i) => i.key !== 'navStory');
