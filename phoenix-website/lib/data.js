export const PROVINCES = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
  Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
};

export const GOVT_UNIVERSITIES = [
  "University of Colombo",
  "University of Peradeniya",
  "University of Sri Jayewardenepura",
  "University of Kelaniya",
  "University of Moratuwa",
  "University of Jaffna",
  "University of Ruhuna",
  "Eastern University, Sri Lanka",
  "South Eastern University of Sri Lanka",
  "Rajarata University of Sri Lanka",
  "Sabaragamuwa University of Sri Lanka",
  "Wayamba University of Sri Lanka",
  "Uva Wellassa University",
  "University of the Visual & Performing Arts",
  "The Open University of Sri Lanka",
  "Other",
];

// ---------- Competition categories ----------
// Each entry drives a /categories/[slug] page via CategoryRegistrationForm.
// Add a new category here (and its slug to the `category` check constraint
// in supabase/schema_phase2.sql) rather than writing new form code.
export const CATEGORIES = [
  {
    slug: "graphic-design",
    dbCategory: "graphic_design",
    label: "Graphic Design",
    description: "Design a poster, logo, or digital artwork for the competition brief.",
    ageCategories: ["Intermediate", "Senior", "University"],
    subCategories: null,
    submissionLabel: "Submission link",
    submissionHint: "Link to your design file(s) — Google Drive, etc.",
  },
];

