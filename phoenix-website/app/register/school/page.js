import RegistrationForm from "@/components/RegistrationForm";
import PageShell from "@/components/PageShell";

export const metadata = { title: "School Registration — Phoenix" };

export default function SchoolRegisterPage() {
  return (
    <PageShell>
      <RegistrationForm type="school" />
    </PageShell>
  );
}
