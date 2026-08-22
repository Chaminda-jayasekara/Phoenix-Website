"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PROVINCES, GOVT_UNIVERSITIES } from "@/lib/data";
import {
  PhoenixMark,
  EmberProgress,
  Field,
  Input,
  Select,
  Card,
  Button,
  ReviewRow,
  ErrorText,
  Divider,
} from "@/components/ui";

function emptyBearer() {
  return { name: "", contact: "", email: "" };
}

function emptyForm() {
  return {
    name: "",
    otherName: "",
    province: "",
    district: "",
    contact: "",
    email: "",
    address: "",
    postalCode: "",
    mic: emptyBearer(),
    president: emptyBearer(),
    secretary: emptyBearer(),
  };
}

export default function RegistrationForm({ type }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmData, setConfirmData] = useState(null);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function updateBearer(role, key, value) {
    setForm((f) => ({ ...f, [role]: { ...f[role], [key]: value } }));
  }

  function validateStep1() {
    const e = {};
    if (!form.name) e.name = "Required";
    if (form.name === "Other" && !form.otherName) e.otherName = "Required";
    if (type === "school") {
      if (!form.province) e.province = "Required";
      if (!form.district) e.district = "Required";
    }
    if (!form.email) e.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (type === "school" && !form.contact) e.contact = "Required";
    if (!form.address) e.address = "Required";
    if (!form.postalCode) e.postalCode = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    ["mic", "president", "secretary"].forEach((role) => {
      if (!form[role].name) e[`${role}Name`] = "Required";
      if (!form[role].contact) e[`${role}Contact`] = "Required";
      if (!form[role].email) e[`${role}Email`] = "Required";
      else if (!/^\S+@\S+\.\S+$/.test(form[role].email)) e[`${role}Email`] = "Invalid email";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const institutionName = form.name === "Other" ? form.otherName : form.name;

      // Generate the ID on the client so we never need to read the row
      // back from the server (anon only has INSERT permission, not
      // SELECT — this keeps registrations write-only from the public
      // side, and avoids needing a SELECT policy just to get an id back).
      const institutionId = crypto.randomUUID();

      const { error: instErr } = await supabase.from("institutions").insert({
        id: institutionId,
        type,
        name: institutionName,
        province: type === "school" ? form.province : null,
        district: type === "school" ? form.district : null,
        contact: form.contact || null,
        email: form.email,
        address: form.address,
        postal_code: form.postalCode,
      });

      if (instErr) throw instErr;

      const bearerRows = ["mic", "president", "secretary"].map((role) => ({
        institution_id: institutionId,
        role,
        name: form[role].name,
        contact: form[role].contact,
        email: form[role].email,
      }));

      const { error: bearerErr } = await supabase.from("office_bearers").insert(bearerRows);
      if (bearerErr) throw bearerErr;

      // TODO: replace with a real WhatsApp group link (e.g. from a lookup
      // table per category, or generated via a WhatsApp API integration).
      const link = `https://chat.whatsapp.com/PhoenixDemo${type === "school" ? "Sch" : "Uni"}${institutionId.slice(
        -6
      )}`;

      setConfirmData({ id: institutionId, link, name: institutionName });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Something went wrong saving your registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmData) {
    return (
      <div className="text-center pt-10">
        <div className="flex justify-center mb-4">
          <PhoenixMark size={48} />
        </div>
        <h2 className="text-[22px] font-extrabold">You're registered!</h2>
        <p className="text-muted text-sm mt-1.5">{confirmData.name} has been added to Phoenix.</p>
        <Card className="mt-6 text-left">
          <div className="text-[12px] text-muted mb-1.5">Registration ID</div>
          <div className="text-[13px] font-mono mb-4">{confirmData.id}</div>
          <div className="text-[12px] text-muted mb-1.5">WhatsApp group link</div>
          <a href={confirmData.link} className="text-[13px] text-teal break-all">
            {confirmData.link}
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold mb-5">
        {type === "school" ? "School" : "University"} Registration
      </h2>

      <EmberProgress step={step} total={3} labels={["Institution", "Office Bearers", "Review"]} />

      {step === 1 && (
        <Card>
          {type === "school" ? (
            <Field label="School name" required>
              <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Nalanda College" />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </Field>
          ) : (
            <Field label="University name" required>
              <Select value={form.name} onChange={(e) => updateField("name", e.target.value)}>
                <option value="">Select from list</option>
                {GOVT_UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
              {form.name === "Other" && (
                <div className="mt-2">
                  <Input value={form.otherName} onChange={(e) => updateField("otherName", e.target.value)} placeholder="Enter university name" />
                  {errors.otherName && <ErrorText>{errors.otherName}</ErrorText>}
                </div>
              )}
            </Field>
          )}

          {type === "school" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Province" required>
                <Select
                  value={form.province}
                  onChange={(e) => {
                    updateField("province", e.target.value);
                    updateField("district", "");
                  }}
                >
                  <option value="">Select</option>
                  {Object.keys(PROVINCES).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
                {errors.province && <ErrorText>{errors.province}</ErrorText>}
              </Field>
              <Field label="District" required>
                <Select value={form.district} onChange={(e) => updateField("district", e.target.value)} disabled={!form.province}>
                  <option value="">Select</option>
                  {(PROVINCES[form.province] || []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
                {errors.district && <ErrorText>{errors.district}</ErrorText>}
              </Field>
            </div>
          )}

          <Field label="Contact No" required={type === "school"} hint={type === "university" ? "Optional" : undefined}>
            <Input value={form.contact} onChange={(e) => updateField("contact", e.target.value)} placeholder="07XXXXXXXX" />
            {errors.contact && <ErrorText>{errors.contact}</ErrorText>}
          </Field>

          <Field label="Email" required>
            <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="office@institution.lk" />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </Field>

          <Field label="Address" required>
            <Input value={form.address} onChange={(e) => updateField("address", e.target.value)} />
            {errors.address && <ErrorText>{errors.address}</ErrorText>}
          </Field>

          <Field label="Postal Code" required>
            <Input value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} />
            {errors.postalCode && <ErrorText>{errors.postalCode}</ErrorText>}
          </Field>

          <div className="flex justify-end mt-2">
            <Button onClick={goNext}>Continue</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <BearerBlock
            title={type === "university" ? "Senior Treasurer / MIC" : "MIC"}
            role="mic"
            form={form}
            errors={errors}
            updateBearer={updateBearer}
          />
          <Divider />
          <BearerBlock title="President" role="president" form={form} errors={errors} updateBearer={updateBearer} />
          <Divider />
          <BearerBlock title="Secretary" role="secretary" form={form} errors={errors} updateBearer={updateBearer} />

          <div className="flex justify-between mt-2">
            <Button variant="text" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <div className="text-[13px] text-muted mb-3">Review before submitting</div>
          <ReviewRow label="Institution" value={form.name === "Other" ? form.otherName : form.name} />
          {type === "school" && <ReviewRow label="Location" value={`${form.district}, ${form.province}`} />}
          <ReviewRow label="Email" value={form.email} />
          <ReviewRow label="Contact" value={form.contact || "—"} />
          <ReviewRow label="Address" value={`${form.address}, ${form.postalCode}`} />
          {["mic", "president", "secretary"].map((role) => (
            <ReviewRow
              key={role}
              label={role === "mic" ? (type === "university" ? "Sr. Treasurer/MIC" : "MIC") : role[0].toUpperCase() + role.slice(1)}
              value={`${form[role].name} · ${form[role].contact}`}
            />
          ))}
          {submitError && <ErrorText>{submitError}</ErrorText>}
          <div className="flex justify-between mt-5">
            <Button variant="text" onClick={() => setStep(2)}>
              ← Back
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit registration"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function BearerBlock({ title, role, form, errors, updateBearer }) {
  return (
    <div>
      <div className="font-bold text-[13.5px] mb-2.5 text-flame2">{title}</div>
      <Field label="Name" required>
        <Input value={form[role].name} onChange={(e) => updateBearer(role, "name", e.target.value)} />
        {errors[`${role}Name`] && <ErrorText>{errors[`${role}Name`]}</ErrorText>}
      </Field>
      <Field label="Contact No (WhatsApp)" required>
        <Input value={form[role].contact} onChange={(e) => updateBearer(role, "contact", e.target.value)} placeholder="07XXXXXXXX" />
        {errors[`${role}Contact`] && <ErrorText>{errors[`${role}Contact`]}</ErrorText>}
      </Field>
      <Field label="Email" required>
        <Input type="email" value={form[role].email} onChange={(e) => updateBearer(role, "email", e.target.value)} />
        {errors[`${role}Email`] && <ErrorText>{errors[`${role}Email`]}</ErrorText>}
      </Field>
    </div>
  );
}
