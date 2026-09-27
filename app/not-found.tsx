import { Button, Eyebrow } from '@/components/ui';
export default function NotFound() {
  return (
    <section className="container not-found">
      <Eyebrow>404 / connection not found</Eyebrow>
      <h1>Signal lost.</h1>
      <p>The system couldn’t find this page.</p>
      <Button href="/">Return Home</Button>
    </section>
  );
}
