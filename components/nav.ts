export interface NavItem {
  /** key in the `common` namespace */
  key: 'navHome' | 'navAbout' | 'navPrograms' | 'navProjects' | 'navStory' | 'navContact';
  href: string;
}

/* The six header links. Programs and Our story are anchors on Home, so from
   any other page they point back at the home route. Home itself has no
   other entry here - the brand mark links there too, but that convention is
   easy to miss, so it gets a labelled link of its own as well. */
export const navItems: NavItem[] = [
  {key: 'navHome', href: '/'},
  {key: 'navAbout', href: '/about'},
  {key: 'navPrograms', href: '/#programs'},
  {key: 'navProjects', href: '/projects'},
  {key: 'navStory', href: '/#story'},
  {key: 'navContact', href: '/contact'}
];

/* The mobile menu drops "Our story", as the design does. */
export const mobileNavItems: NavItem[] = navItems.filter((i) => i.key !== 'navStory');
