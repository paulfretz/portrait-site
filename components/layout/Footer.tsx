import Link from 'next/link';

/**
 * Site Footer Component
 * Footer with contact info, social links, and copyright
 *
 * Features:
 * - Contact information
 * - Social media links (Instagram, Facebook)
 * - Copyright notice
 * - Clean, minimal design with sage green accents
 *
 * @component
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-light text-white">
              DJ Coveno Portraits
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Capturing authentic moments and timeless memories through 
              professional portrait photography in Montana.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-neutral-400">
              <p>📧 dj@djcovenoportraits.com</p>
              <p>📱 (406) 555-0123</p>
              <p>📍 Missoula, Montana</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white uppercase tracking-wider">
              Follow
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/djcovenoportraits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-sage-400 transition-colors duration-200"
                aria-label="Follow on Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875z"/>
                  <path d="M12.017 5.838c-3.416 0-6.179 2.763-6.179 6.179s2.763 6.179 6.179 6.179 6.179-2.763 6.179-6.179-2.763-6.179-6.179-6.179zm0 10.108c-2.167 0-3.929-1.762-3.929-3.929s1.762-3.929 3.929-3.929 3.929 1.762 3.929 3.929-1.762 3.929-3.929 3.929z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/djcovenoportraits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-sage-400 transition-colors duration-200"
                aria-label="Follow on Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-neutral-400">
              © {currentYear} DJ Coveno Portraits. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-neutral-400">
              <Link href="/privacy" className="hover:text-sage-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-sage-400 transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
