import { redirect } from 'next/navigation';

export default function ThoughtsRedirect() {
  redirect('/blog?filter=reflections');
}
