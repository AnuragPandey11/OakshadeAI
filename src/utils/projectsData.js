// src/utils/projectsData.js
// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for the portfolio / "Our Work".
//
// `projectGroups` powers the home "Our Work" section: each group is a TAB,
// and a tab can hold MANY entries. On the home section those entries are
// shown one at a time with a "1 of N" slider (dots + arrows).
//
// Every entry also carries a `category`, which powers the single category
// filter on the /work page. Add a project by dropping an entry into a group
// (and add a new group object to create a new tab).
//
// Optional per-entry fields:
//   • `status`  — small badge above the title, e.g. for work still in
//                 development & testing. Omit it for shipped, live projects.
//   • `meta`    — short line under the description (e.g. store availability).
//
// NOTE ON IMAGES: these are stock photos standing in for real screenshots.
// Drop screenshots into `public/media/work/` and swap the `image` values for
// e.g. "/media/work/oakshade-crm.jpg" when they're ready.
// ─────────────────────────────────────────────────────────────────────────

const DEV_STATUS = "In development & testing phase";

export const projectGroups = [
  {
    id: "featured",
    label: "Featured",
    entries: [
      {
        id: "platinum-township",
        title: "Platinum Township",
        category: "Real Estate",
        description:
          "An immersive virtual walkthrough of a residential township — 360° panoramic views and interactive scene exploration that let buyers tour the development before a brick is laid.",
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
        link: "https://platinum-township.vercel.app/",
        status: DEV_STATUS,
      },
      {
        id: "oakshade-crm",
        title: "Oakshade CRM",
        category: "SaaS Platform",
        description:
          "Our own customer relationship platform — leads, pipelines, and client conversations in one place, built to keep growing teams organised without the enterprise bloat.",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
        link: "https://crm.oakshade-ai.com/",
      },
      {
        id: "the-jagirdars",
        title: "The Jagirdars",
        category: "Travel & Hospitality",
        description:
          "A holistic yatra ecosystem for a collection of heritage homestays in Uttarakhand — curated properties and yatra services presented as one unhurried, premium experience.",
        image:
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600&auto=format&fit=crop",
        link: "https://the-jagirdars.vercel.app/",
        status: DEV_STATUS,
      },
      {
        id: "medhya-design-studio",
        title: "Medhya Design Studio",
        category: "Business Website",
        description:
          "A portfolio site for a multidisciplinary architecture and interiors practice — residential, commercial, hospitality, and cultural work presented so the projects carry the page.",
        image:
          "https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?q=80&w=1600&auto=format&fit=crop",
        link: "https://medhya-design-studio-five.vercel.app/",
        status: DEV_STATUS,
      },
    ],
  },
  {
    id: "web-mobile",
    label: "Web & Mobile",
    entries: [
      {
        id: "complete-waterproofing",
        title: "Complete Waterproofing Systems",
        category: "Business Website",
        description:
          "A clear, credibility-first website for a waterproofing contractor — services, past projects, and enquiries structured so prospective clients can get in touch in a couple of taps.",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
        link: "https://completewaterproofingsystems.in/",
      },
      {
        id: "sehatbuddy",
        title: "SehatBuddy",
        category: "Web & Mobile App",
        description:
          "A healthcare companion that brings appointments, records, and day-to-day health tracking into one simple experience across web and mobile.",
        meta: "Also available on the Play Store and the App Store",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop",
        link: "https://www.sehatbuddy.in/",
      },
      {
        id: "kayo-physio",
        title: "Kayo Physio",
        category: "Web & Mobile App",
        description:
          "A physiotherapy platform pairing a patient-facing app with a web app for clinics — bookings, guided exercise plans, and progress tracking between sessions.",
        meta: "Mobile app + web app",
        image:
          "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?q=80&w=1600&auto=format&fit=crop",
        link: "https://kayo-physio.vercel.app/",
        status: DEV_STATUS,
      },
    ],
  },
  {
    id: "travel-hospitality",
    label: "Travel & Hospitality",
    entries: [
      {
        id: "qintara-living",
        title: "Qintara Living",
        category: "Travel & Hospitality",
        description:
          "A hospitality brand site for a premium stay experience — rooms, amenities, and enquiries presented with the polish guests expect before they book.",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
        link: "https://www.qintaraliving.com/",
      },
      {
        id: "aum-tourism",
        title: "Aum Tourism",
        category: "Travel & Hospitality",
        description:
          "A tour operator site that turns packages, itineraries, and destinations into something travellers can browse and enquire about in minutes.",
        image:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop",
        link: "https://aumtourism.in/",
      },
      {
        id: "tour-my-holiday",
        title: "Tour My Holiday",
        category: "Travel & Hospitality",
        description:
          "A holiday planning experience built around discovery — curated trips and destination pages that guide visitors from browsing to a booking enquiry.",
        image:
          "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop",
        link: "https://tourmyholiday.netlify.app/",
      },
      {
        id: "real-jungle-project",
        title: "The Real Jungle Project",
        category: "Travel & Hospitality",
        description:
          "A site for an eco-tourism retreat, leaning on immersive photography and an unhurried layout to sell the experience of the place itself.",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
        link: "https://the-real-jungle-project.vercel.app/",
        status: DEV_STATUS,
      },
    ],
  },
];

// Flattened list of every project (used by the /work page grid).
export const allProjects = projectGroups.flatMap((group) => group.entries);

// Unique category list for the /work filter, with "All" first.
export const projectCategories = [
  "All",
  ...Array.from(new Set(allProjects.map((p) => p.category))),
];
