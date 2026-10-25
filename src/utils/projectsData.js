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
        image: "/media/platinum-poster.jpg",
        video: "/Platinum.mov",
        videoMp4: "/media/platinum-preview.mp4",
        link: "https://platinum-township.vercel.app/",
      },
      {
        id: "solar-portfolio-cms",
        title: "Solar Portfolio CMS",
        category: "SaaS Platform",
        blurb:
          "Plant-portfolio CMS for a solar automation company, fed live by the devices inside each power plant.",
        description:
          "Redis holds the live state the dashboard reads from, so it never has to query history to show what a plant is doing right now, while every reading is also persisted to PostgreSQL for later retrieval. A React front end puts the whole portfolio — 50+ plants — in one place.",
        image: "/media/solar-cms-poster.jpg",
        video: "/cms-video.mp4",
        videoMp4: "/cms-video.mp4",
      },
      {
        id: "oakshade-crm",
        title: "Oakshade CRM",
        category: "SaaS Platform",
        description:
          "Our own customer relationship platform — leads, pipelines, and client conversations in one place, built to keep growing teams organised without the enterprise bloat.",
        image: "/media/crm-poster.jpg",
        video: "/CRM.mov",
        videoMp4: "/media/crm-preview.mp4",
        link: "https://crm.oakshade-ai.com/",
      },
      {
        id: "kayo-physio",
        title: "Kayo Physio",
        category: "Web & Mobile App",
        description:
          "A physiotherapy platform pairing a patient-facing app with a web app for clinics — bookings, guided exercise plans, and progress tracking between sessions.",
        meta: "Mobile app + web app",
        image: "/media/kayo-poster.jpg",
        video: "/kayo-video.mp4",
        videoMp4: "/kayo-video.mp4",
        link: "https://kayo-physio.vercel.app/",
        status: DEV_STATUS,
      },
    ],
  },
  {
    id: "web-mobile",
    label: "Web & Mobile",
    entries: [
      {
        id: "kayo-physio",
        title: "Kayo Physio",
        category: "Web & Mobile App",
        description:
          "A physiotherapy platform pairing a patient-facing app with a web app for clinics — bookings, guided exercise plans, and progress tracking between sessions.",
        meta: "Mobile app + web app",
        image: "/media/kayo-poster.jpg",
        video: "/kayo-video.mp4",
        videoMp4: "/kayo-video.mp4",
        link: "https://kayo-physio.vercel.app/",
        status: DEV_STATUS,
      },
      {
        id: "medhya-design-studio",
        title: "Medhya Design Studio",
        category: "Business Website",
        description:
          "A portfolio site for a multidisciplinary architecture and interiors practice — residential, commercial, hospitality, and cultural work presented so the projects carry the page.",
        image: "/media/medhya-poster.jpg",
        video: "/Medhya.mov",
        videoMp4: "/media/medhya-preview.mp4",
        link: "https://medhya-design-studio-five.vercel.app/",
        status: DEV_STATUS,
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
        id: "complete-waterproofing",
        title: "Complete Waterproofing Systems",
        category: "Business Website",
        description:
          "A clear, credibility-first website for a waterproofing contractor — services, past projects, and enquiries structured so prospective clients can get in touch in a couple of taps.",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
        link: "https://completewaterproofingsystems.in/",
      },
    ],
  },
  {
    id: "travel-hospitality",
    label: "Travel & Hospitality",
    entries: [
      {
        id: "real-jungle-project",
        title: "The Real Jungle Project",
        category: "Travel & Hospitality",
        description:
          "A site for an eco-tourism retreat, leaning on immersive photography and an unhurried layout to sell the experience of the place itself.",
        image: "/media/jungle-poster.jpg",
        video: "/Jungle.mov",
        videoMp4: "/media/jungle-preview.mp4",
        link: "https://the-real-jungle-project.vercel.app/",
        status: DEV_STATUS,
      },
      {
        id: "qintara-living",
        title: "Qintara Living",
        category: "Travel & Hospitality",
        description:
          "A hospitality brand site for a premium stay experience — rooms, amenities, and enquiries presented with the polish guests expect before they book.",
        image: "/media/qintara-poster.jpg",
        video: "/Qintara.mov",
        videoMp4: "/media/qintara-preview.mp4",
        link: "https://www.qintaraliving.com/",
      },
      {
        id: "tour-my-holiday",
        title: "Tour My Holiday",
        category: "Travel & Hospitality",
        description:
          "A holiday planning experience built around discovery — curated trips and destination pages that guide visitors from browsing to a booking enquiry.",
        image: "/media/tmh-poster.jpg",
        video: "/tmh-video.mp4",
        videoMp4: "/tmh-video.mp4",
        link: "https://tourmyholiday.netlify.app/",
      },
      {
        id: "the-jagirdars",
        title: "The Jagirdars",
        category: "Travel & Hospitality",
        description:
          "A holistic yatra ecosystem for a collection of heritage homestays in Uttarakhand — curated properties and yatra services presented as one unhurried, premium experience.",
        image: "/media/jagirdars-poster.jpg",
        video: "/Jagirdars.mov",
        videoMp4: "/media/jagirdars-preview.mp4",
        link: "https://the-jagirdars.vercel.app/",
        status: DEV_STATUS,
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
    ],
  },
];

// Flattened list of every unique project (used by the /work page grid).
export const allProjects = (() => {
  const seenIds = new Set();
  return projectGroups
    .flatMap((group) => group.entries)
    .filter((project) => {
      if (seenIds.has(project.id)) return false;
      seenIds.add(project.id);
      return true;
    });
})();

// Unique category list for the /work filter, with "All" first.
export const projectCategories = [
  "All",
  ...Array.from(new Set(allProjects.map((p) => p.category))),
];
