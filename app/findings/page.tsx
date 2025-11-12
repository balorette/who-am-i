import { redirect } from 'next/navigation';

export default function FindingsRedirect() {
  redirect('/blog?filter=insights');
}
