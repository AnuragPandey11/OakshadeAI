// src/components/ui/footer.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { brandConfig } from "../../utils/brandConfig";
import { services } from "../../utils/servicesData";

const socialLinks = [
  { label: "Instagram", href: brandConfig.socialMedia.instagram, Icon: FaInstagram },
  { label: "Facebook", href: brandConfig.socialMedia.facebook, Icon: FaFacebookF },
  { label: "LinkedIn", href: brandConfig.socialMedia.linkedin, Icon: FaLinkedinIn },
];

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "All Services", to: "/services" },
  { label: "Our Work", to: "/work" },
  { label: "Contact", to: "/", state: { scrollTo: "contact" } },
];

function ColumnHeading({ children }) {
  return (
    <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
      {children}
    </h4>
  );
}

const linkClass =
  "text-sm text-neutral-400 transition-colors hover:text-white";

export default function Footer() {
  const { address } = brandConfig;

  return (
    <footer className="w-full bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link to="/" aria-label={brandConfig.name} className="inline-block">
              <img
                src="/media/oakshade-logo.png"
                alt={brandConfig.name}
                className="h-24 w-auto invert"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-400">
              {brandConfig.tagline}.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:border-white hover:bg-white hover:text-neutral-900"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <ColumnHeading>Services</ColumnHeading>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className={linkClass}>
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <ColumnHeading>Explore</ColumnHeading>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} state={link.state} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <ColumnHeading>Get in touch</ColumnHeading>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${brandConfig.email}`} className={linkClass}>
                  {brandConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${brandConfig.phone.replace(/[^\d+]/g, "")}`}
                  className={linkClass}
                >
                  {brandConfig.phone}
                </a>
              </li>
              <li className="pt-1 text-sm leading-relaxed text-neutral-400">
                {address.line1}
                <br />
                {address.line2}
                <br />
                {address.city}
              </li>
            </ul>

            <Link
              to="/"
              state={{ scrollTo: "contact" }}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
            >
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-neutral-500 md:flex-row">
          <span>
            © {new Date().getFullYear()} {brandConfig.name}. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link to="/services" className="transition-colors hover:text-white">
              Services
            </Link>
            <Link to="/work" className="transition-colors hover:text-white">
              Work
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "contact" }}
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
