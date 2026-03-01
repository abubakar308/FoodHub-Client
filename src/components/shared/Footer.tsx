import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Partner with Us", href: "/partner" },
  ],
  platform: [
    { name: "Browse Meals", href: "/meals" },
    { name: "Top Restaurants", href: "/providers" },
    { name: "Special Offers", href: "/offers" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        
        <div className="grid gap-12 lg:grid-cols-5 md:grid-cols-2">

          {/* 1. Brand & Description */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
              Food<span className="text-green-500">Hub</span> 🍔
            </Link>
            <p className="text-base text-slate-400 max-w-sm leading-relaxed">
              Bringing the finest local flavors straight to your doorstep. 
              We bridge the gap between talented chefs and hungry foodies.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* 2. Quick Links */}
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Platform" links={footerLinks.platform} />

          {/* 3. Support & Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[2px] text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm hover:text-green-500 transition-colors cursor-pointer">
                <Phone size={16} className="text-green-500" /> +880 1234 567 890
              </li>
              <li className="flex items-center gap-3 text-sm hover:text-green-500 transition-colors cursor-pointer">
                <Mail size={16} className="text-green-500" /> support@foodhub.com
              </li>
              <li className="flex items-start gap-3 text-sm hover:text-green-500 transition-colors cursor-pointer">
                <MapPin size={16} className="text-green-500 shrink-0" /> Dhaka, Bangladesh
              </li>
            </ul>
          </div>

        </div>

        {/* 4. Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} <span className="text-slate-300">FoodHub Inc.</span> All rights reserved.
          </p>
          
          {/* Payment Badges (Mock) */}
          <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
             <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payments</span>
             <div className="h-6 w-10 bg-slate-700 rounded" />
             <div className="h-6 w-10 bg-slate-700 rounded" />
             <div className="h-6 w-10 bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div className="space-y-6">
      <h4 className="text-sm font-black uppercase tracking-[2px] text-white">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 hover:text-green-500 hover:translate-x-1 inline-block transition-all duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer shadow-lg">
      {icon}
    </div>
  );
}