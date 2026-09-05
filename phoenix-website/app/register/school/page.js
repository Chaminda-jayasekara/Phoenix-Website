import RegistrationForm from "@/components/RegistrationForm";
import PageShell from "@/components/PageShell";
import { getSiteSettings } from "@/lib/categories";

// Cached for 60 seconds, then refreshed on the next request — avoids
// hitting the database on every single page view under high traffic,
// while staying close enough to real-time for content that rarely
// changes mid-minute (categories, rules, settings).
export const revalidate = 60;
export const metadata = { title: "School Registration — Phoenix" };

export default async function SchoolRegisterPage() {
  const settings = await getSiteSettings();
  return (
    <PageShell>
      <RegistrationForm type="school" whatsappLink={settings?.school_whatsapp_link || null} />
    </PageShell>
  );
}
