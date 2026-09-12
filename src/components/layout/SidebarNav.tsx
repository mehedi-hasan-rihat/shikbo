"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

type SidebarNavProps = {
  sections: NavSection[];
};

export function SidebarNav({ sections }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="sidebar-nav" style={{ flex: 1 }}>
      {sections.map((section, i) => (
        <div key={i}>
          {section.label && (
            <p className="sidebar-section-label">{section.label}</p>
          )}
          {section.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item${isActive ? " active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon && (
                  <span aria-hidden="true" style={{ flexShrink: 0 }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
