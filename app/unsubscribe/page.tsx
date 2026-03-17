import { removeSubscriber } from '@/lib/redis';
import { verifyUnsubscribeToken } from '@/lib/newsletter';
import Section from '@/components/Section';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
};

interface UnsubscribePageProps {
  searchParams: Promise<{ email?: string; token?: string }>;
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { email, token } = await searchParams;

  if (!email || !token) {
    return (
      <div className="py-12">
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Invalid Link</h1>
            <p className="text-slate-300 mb-8">
              This unsubscribe link is invalid or incomplete.
            </p>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </Section>
      </div>
    );
  }

  const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();
  const isValid = verifyUnsubscribeToken(normalizedEmail, token);

  if (!isValid) {
    return (
      <div className="py-12">
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Invalid Link</h1>
            <p className="text-slate-300 mb-8">
              This unsubscribe link is invalid or has expired.
            </p>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </Section>
      </div>
    );
  }

  let success = false;
  let errorMessage = '';

  try {
    await removeSubscriber(normalizedEmail);
    success = true;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    errorMessage = 'An error occurred while processing your request. Please try again later.';
  }

  if (!success) {
    return (
      <div className="py-12">
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h1>
            <p className="text-slate-300 mb-8">{errorMessage}</p>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="py-12">
      <Section>
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Unsubscribed</h1>
          <p className="text-slate-300 mb-8">
            You have been successfully unsubscribed from the newsletter.
            You will no longer receive email notifications about new blog posts.
          </p>
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </Section>
    </div>
  );
}
