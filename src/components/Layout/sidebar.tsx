import { Home, Package, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: Package },
  { name: 'Service Orders', href: '/service-orders', icon: Users },
];

export function Sidebar() {
  return (
    <aside className="border-r border-border/40 bg-background px-10 pb-4 pt-4 min-h-[93vh]">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-accent hover:text-accent-foreground"
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
    </aside>
  );
} 