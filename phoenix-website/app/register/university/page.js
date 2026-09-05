import RegistrationForm from "@/components/RegistrationForm";
import PageShell from "@/components/PageShell";
import { getSiteSettings } from "@/lib/categories";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const metadata = { title: "University Registration — Phoenix" };

export default async function UniversityRegisterPage() {
  const settings = await getSiteSettings();
  return (
    <PageShell>
      <RegistrationForm type="university" whatsappLink={settings?.university_whatsapp_link || null} />
    </PageShell>
  );
}
