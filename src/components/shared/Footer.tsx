import Link from "next/link";

const footerLinks = {
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  platform: [
    { name: "Meals", href: "/meals" },
    { name: "Providers", href: "/providers" },
    { name: "Pricing", href: "/pricing" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-14">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-primary">FoodHub 🍔</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover great meals from local providers. Fast, fresh, and
              delivered with care.
            </p>
          </div>

          {/* Company */}
          <FooterColumn title="Company" links={footerLinks.company} />

          {/* Platform */}
          <FooterColumn title="Platform" links={footerLinks.platform} />

          {/* Legal */}
          <FooterColumn title="Legal" links={footerLinks.legal} />

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FoodHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
