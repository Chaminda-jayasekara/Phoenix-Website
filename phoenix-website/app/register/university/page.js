import RegistrationForm from "@/components/RegistrationForm";
import PageShell from "@/components/PageShell";

export const metadata = { title: "University Registration — Phoenix" };

export default function UniversityRegisterPage() {
  return (
    <PageShell>
      <RegistrationForm type="university" />
    </PageShell>
  );
}
