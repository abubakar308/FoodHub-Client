import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const footerLinks = {
  platform: [
    { name: "Browse Meals", href: "/meals" },
    { name: "Top Providers", href: "/providers" },
    { name: "Special Offers", href: "/offers" },
    { name: "Categories", href: "/categories" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Become a Provider", href: "/register" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/mdabubakar308",
    icon: <FaFacebookF size={16} />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/md.abubakar.308",
    icon: <FaInstagram size={16} />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/abubakar308",
    icon: <FaLinkedin size={16} />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-lg shadow-sm ring-1 ring-primary/10">
                🍽️
              </span>
              <span>
                Quick<span className="text-primary">Platter</span>
              </span>
            </Link>

            <p className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              Bringing trusted local flavors straight to your doorstep. We
              connect talented providers with hungry customers through a
              seamless, fast, and delightful ordering experience.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((item) => (
                <SocialIcon
                  key={item.name}
                  href={item.href}
                  label={item.name}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>

          {/* Platform */}
          <FooterColumn title="Platform" links={footerLinks.platform} />

          {/* Company */}
          <FooterColumn title="Company" links={footerLinks.company} />

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">
              Contact
            </h4>

            {/* <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a
                  href="tel:+8801234567890"
                  className="group flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+880 1773398308</span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:mdabubakar.dev@gmail.com"
                  className="group flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  <span>mdabubakar.dev@gmail.com</span>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul> */}

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-card-foreground">
                Need help with an order?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Our support team is here to assist you with tracking, refunds,
                and provider-related issues.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-foreground">QuickPlatter</span>.
            All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Secure Payments
            </span>
            <div className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground">
              Visa
            </div>
            <div className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground">
              MasterCard
            </div>
            <div className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground">
              bKash
            </div>
          </div>
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
    <div className="space-y-6">
      <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">
        {title}
      </h4>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-primary"
            >
              <span>{link.name}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
    >
      {icon}
    </a>
  );
}