import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bgSecondary border-t border-bgSecondary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-display font-bold text-primary mb-4">Erotica</h3>
            <p className="text-textSecondary text-sm">
              A platform for sharing stories and connecting with readers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>
                <Link href="/stories" className="hover:text-text transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/confessions" className="hover:text-text transition-colors">
                  Confessions
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-text transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>
                <Link href="/terms" className="hover:text-text transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-text transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/content-policy" className="hover:text-text transition-colors">
                  Content Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>
                <Link href="/help" className="hover:text-text transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-text transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-bgSecondary text-center text-sm text-textMuted">
          <p>&copy; {currentYear} Erotica. All rights reserved.</p>
          <p className="mt-2">18+ Only. Please confirm you are of legal age to view adult content.</p>
        </div>
      </div>
    </footer>
  );
};

