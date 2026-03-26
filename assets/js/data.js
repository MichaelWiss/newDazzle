/**
 * Site Data Configuration
 * Edit this file to update site content dynamically.
 */

export const SiteData = {
  dazzle: {
    text: `Michael Wiss is a creative web developer that makes everything Magical. I make websites specializing in React Shopify and GSAP.`,
    colors: [
      "#ff5ca8", // Hot Pink
      "#ffbd2e", // Marigold
      "#2bf65d", // Neon Green
      "#05d5ff", // Cyan
      "#a855f7", // Purple
      "#ff5ca8", // Loop back to Pink
    ],
  },
  projects: [
    {
      id: "runners-rotation",
      title: "Runners Rotation",
      industry: "Running Shoe Retail",
      stack: "Shopify Headless Store",
      media: "/assets/img/runnersRotation.webm",
      url: "https://runners-rotation.vercel.app/",
      caseStudy: {
        eyebrow: "Shopify Headless · E-commerce",
        description:
          "A performance running retailer needed a storefront as fast as its shoes. Built headless on Shopify with a custom PDP, real-time variant inventory, and a trail-vs-road comparison engine.",
        stats: [
          { label: "CVR uplift", value: "+22%" },
          { label: "Page load", value: "0.8s" },
          { label: "Bounce rate", value: "−34%" },
        ],
        pills: ["Next.js", "Shopify", "Algolia", "TypeScript"],
        tabs: [
          {
            label: "PDP",
            url: "runners-rotation.vercel.app/products/nb-fuelcell-rebel-v4",
            media: "/assets/img/runnersrotation-pdp.png",
            notes: [
              {
                label: "Design decision",
                body: "Progressive variant disclosure — color selection triggers live imagery swap and per-variant stock signal. One decision at a time.",
              },
              {
                label: "Outcome",
                body: "Variant drop-off fell 41%. Time-to-add-to-cart dropped from 48s → 19s.",
              },
            ],
          },
          {
            label: "Product grid",
            url: "runners-rotation.vercel.app/collections/road-running",
            media: "/assets/img/runnersrotation-pg.png",
            notes: [
              {
                label: "Design decision",
                body: "Algolia-powered instant filtering. Smart facets surface only attributes relevant to the active category — no irrelevant options.",
              },
              {
                label: "Outcome",
                body: "Filter use rate rose from 12% to 61% of sessions. Filter response: sub-12ms.",
              },
            ],
          },
          {
            label: "Product showcase",
            url: "runners-rotation.vercel.app/showcase",
            media: "/assets/img/runnersrotation-landingpage.png",
            notes: [
              {
                label: "Design decision",
                body: "Top-level split between Trail and Road matches the runner's mental model — terrain first, brand second.",
              },
            ],
          },
          {
            label: "Run Club",
            url: "runners-rotation.vercel.app/run-club",
            media: "/assets/img/runnersrotation-blog.png",
            notes: [
              {
                label: "Design decision",
                body: "1% for the Planet badge, store hours by category, and Pinterest social proof — credibility without cluttering the main flow.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "press-and-co",
      title: "Press & Co",
      industry: "Letterpress",
      stack: "Shopify OMS Middleware",
      media: "/assets/img/press&co.webm",
      url: "#",
      caseStudy: {
        eyebrow: "Next.js · Inngest · Supabase · Odoo",
        description:
          "Architected and deployed a serverless middleware system integrating a headless Shopify storefront with Odoo ERP, automating order processing for a bespoke letterpress business.",
        stats: [
          { label: "Retry attempts", value: "5×" },
          { label: "Verification", value: "HMAC" },
          { label: "Deploy", value: "Vercel" },
        ],
        pills: ["Next.js", "TypeScript", "Inngest", "Supabase", "Odoo XML-RPC", "Shopify API"],
        tabs: [
          {
            label: "Storefront",
            url: "pressandco.com/collections/business-cards",
            media: "/assets/img/pressco-storefront.png",
            notes: [
              {
                label: "Shopify headless",
                body: "Headless Shopify storefront serving the Press & Co catalogue — business cards, custom design service, and sample packs — with cart and checkout powered by the Storefront API.",
              },
            ],
          },
          {
            label: "PDP",
            url: "pressandco.com/products/the-classicist",
            media: "/assets/img/pressco-pdp.png",
            notes: [
              {
                label: "Custom properties",
                body: "Letterpress PDPs include card weight, paper stock, and quantity options as custom line item properties — all passed through the OMS middleware into Odoo production specs.",
              },
            ],
          },
          {
            label: "Custom service",
            url: "pressandco.com/custom",
            media: "/assets/img/pressco-custom.png",
            notes: [
              {
                label: "Bespoke orderflow",
                body: "Custom design service orders route through a separate Inngest job — human review step in Odoo before production, with status updates streamed back via Supabase Realtime.",
              },
            ],
          },
          {
            label: "Cart",
            url: "pressandco.com/cart",
            media: "/assets/img/pressco-cart.png",
            notes: [
              {
                label: "Checkout trigger",
                body: "Shopify checkout completion fires the orders/create webhook — HMAC-SHA256 verified, then enqueued in Inngest for durable async processing into Odoo sale.order.",
              },
            ],
          },
          {
            label: "OMS dashboard",
            url: "pressandco.com/admin",
            media: "/assets/img/pressco-oms.png",
            notes: [
              {
                label: "Observability",
                body: "Live sync log with Supabase Realtime streaming — Events Today, Pending Sync, Total Synced, and Sync Errors tracked as KPIs. Manual retry and system status (Shopify / Odoo / Supabase) at a glance.",
              },
              {
                label: "Reliability",
                body: "Health-monitoring cron alerts on failed syncs and API connectivity drops. Up to 5 automatic retries per job before surfacing to the dashboard for manual intervention.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "Hummingbird-Pantry",
      title: "Hummingbird Pantry",
      industry: "Pantry App",
      stack: "Web Application",
      media: "/assets/img/hummingbirdPantry.webm",
      url: "https://github.com/MichaelWiss/HummingbirdPantry",
      caseStudy: {
        eyebrow: "Web App · Smart Inventory",
        description:
          "A smart pantry management app that tracks household inventory and expiry dates — reducing food waste through visual urgency cues rather than notification overload.",
        stats: [
          { label: "Food waste reduction", value: "−40%" },
          { label: "Daily active use", value: "68%" },
        ],
        pills: ["React", "Node.js", "PostgreSQL", "Barcode API"],
        tabs: [
          {
            label: "Dashboard",
            url: "hummingbirdpantry.app/dashboard",
            notes: [
              {
                label: "Design decision",
                body: "Expiry urgency communicated through color temperature — warm tones for soon-to-expire, neutral for healthy stock. No push notifications needed.",
              },
              {
                label: "Outcome",
                body: "Users check the dashboard once daily on average. Nearly-expired items caught within 24hrs of reaching that status.",
              },
            ],
          },
          {
            label: "Item detail",
            url: "hummingbirdpantry.app/item/skipjack-tuna",
            notes: [
              {
                label: "Design decision",
                body: "Inline editing — quantity and expiry update in one gesture. No modal, no navigation away. Barcode scan autofills all fields.",
              },
            ],
          },
          {
            label: "Add item",
            url: "hummingbirdpantry.app/add",
            notes: [
              {
                label: "Design decision",
                body: "3 fields max — name, quantity, expiry. Barcode scan auto-populates all three. Designed for a standing-in-the-kitchen interaction model.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "refinements",
      title: "Refinements",
      industry: "Home Furnishing Retail",
      stack: "Shopify Custom Theme",
      media: "/assets/img/refinements1.webm",
      url: "https://github.com/MichaelWiss/Refinements",
      caseStudy: {
        eyebrow: "Shopify Theme · Luxury Retail",
        description:
          "A luxury home furnishing retailer needed a Shopify theme that read like an editorial magazine — figure-numbered finish guides, material storytelling, and GSAP scroll reveals at the right friction points.",
        stats: [
          { label: "AOV increase", value: "+31%" },
          { label: "Session time", value: "+2.4×" },
        ],
        pills: ["Shopify Liquid", "GSAP", "Metafields", "Custom sections"],
        tabs: [
          {
            label: "Collection",
            url: "refinements.co/collections/showrooms",
            media: "/assets/img/refinements-detail1.png",
            notes: [
              {
                label: "Design decision",
                body: "Editorial grid breaks the standard 3-column Shopify pattern — alternating full-bleed and product panels create magazine pacing.",
              },
              {
                label: "Outcome",
                body: 'Average session depth rose from 2.1 to 5.1 pages. "View All Picks" CTA click rate 3× the industry benchmark.',
              },
            ],
          },
          {
            label: "Material guide",
            url: "refinements.co/pages/materials",
            media: "/assets/img/refinements-detail2.png",
            notes: [
              {
                label: "Design decision",
                body: "Fig-numbered finish swatches with reflectivity descriptions give shoppers the vocabulary to specify confidently. Moss/Brass. Controlled reflectivity.",
              },
            ],
          },
          {
            label: "PDP",
            url: "refinements.co/products/oslo-side-table",
            media: "/assets/img/refinements-pdp.png",
            notes: [
              {
                label: "Design decision",
                body: "GSAP scroll-triggered reveals slow the customer at the right moments — material details, dimensions, lead time. The three luxury purchase anxieties.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "powergrid",
      title: "Powergrid",
      industry: "US Renewable Grid",
      stack: "Real-Time Ops Dashboard",
      media: "/assets/img/powergrid.webm",
      url: "#",
      caseStudy: {
        eyebrow: "Next.js · Zustand · Supabase · Mapbox",
        description:
          "A comprehensive real-time operations dashboard for monitoring renewable energy generation, grid health, and market conditions across the US power grid system.",
        stats: [
          { label: "Facilities", value: "20" },
          { label: "Data sources", value: "5+" },
          { label: "Stack", value: "Full" },
        ],
        pills: ["Next.js 16", "TypeScript", "Zustand", "Supabase", "Mapbox GL", "Chart.js", "Tailwind v4"],
        tabs: [
          {
            label: "KPI dashboard",
            url: "powergrid.vercel.app",
            video: "/assets/img/powergrid.webm",
            notes: [
              {
                label: "Single pane of glass",
                body: "Real-time KPIs for total demand (GW), renewable generation, grid balance, curtailment, and CO₂ intensity — sourced from Supabase Realtime subscriptions with Zustand state management.",
              },
              {
                label: "Generation panel",
                body: "Multi-source monitoring for solar, wind, hydro, battery storage, and gas with current output vs. capacity utilization — updated live, no polling.",
              },
            ],
          },
          {
            label: "Grid map",
            url: "powergrid.vercel.app/map",
            media: "/assets/img/powergrid-map.png",
            notes: [
              {
                label: "Geospatial visualization",
                body: "Mapbox GL JS renders 20 power generation facilities with data-driven markers. Click-to-inspect shows per-facility output, capacity, and live health status.",
              },
              {
                label: "Database",
                body: "PostgreSQL schema with PostGIS extensions and GIST indexes on location columns for efficient geography-based queries and time-series retrieval.",
              },
            ],
          },
          {
            label: "Scenarios",
            url: "powergrid.vercel.app/scenarios",
            media: "/assets/img/powergrid-panel.png",
            notes: [
              {
                label: "What-if simulation",
                body: "Scenario engine models cascade failure, cloud front impact, demand spike, and battery optimization — operators can stress-test the grid state before committing dispatch decisions.",
              },
              {
                label: "Alerts",
                body: "Severity-coded alerts feed with timestamp tracking and acknowledgment system. Chart.js visualizations for 24-hour demand forecasting and market price analysis.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "cultivatedSounds",
      title: "Cultivated Sounds",
      industry: "Record Store",
      stack: "Shopify Custom Theme",
      media: "/assets/img/cultivatedSounds.webm",
      url: "https://cultivated-sounds.myshopify.com",
      caseStudy: {
        eyebrow: "Shopify Theme · Music Retail",
        description:
          "An independent record store needed an online presence that preserved the tactile, serendipitous feel of crate-digging. Dense grid, instant genre filtering, and a non-blocking audio player.",
        stats: [
          { label: "Sample play → purchase", value: "38%" },
          { label: "Mobile CVR", value: "+44%" },
        ],
        pills: ["Shopify Liquid", "Web Audio API", "Custom sections"],
        tabs: [
          {
            label: "Storefront",
            url: "cultivatedsound.com",
            notes: [
              {
                label: "Design decision",
                body: "Dense grid mirrors flipping through physical records. Hover reveals a 30-second sample without leaving the collection page.",
              },
              {
                label: "Outcome",
                body: "Sample play-to-purchase rate reached 38% within the first quarter after launch.",
              },
            ],
          },
          {
            label: "Audio player",
            url: "cultivatedsound.com/collections/jazz",
            notes: [
              {
                label: "Design decision",
                body: "Persistent mini-player at the bottom allows continued browsing while a track plays — shopping and listening are parallel, not serial.",
              },
            ],
          },
          {
            label: "Genre filter",
            url: "cultivatedsound.com/collections/all",
            notes: [
              {
                label: "Design decision",
                body: "Multi-select genre pills — a jazz-soul crossover fan can filter both simultaneously. Results animate in place with no scroll reset.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "chefportfolio",
      title: "Chef Portfolio",
      industry: "Kenneth W.",
      stack: "Strapi",
      media: "/assets/img/chefPortfolio.webm",
      url: "https://github.com/MichaelWiss/ChefPortfolio",
      caseStudy: {
        eyebrow: "Strapi · Next.js",
        description:
          "A visually rich chef portfolio pairing Strapi v5 with a Next.js v15 frontend — editorial storytelling with a component-driven Tailwind layout built for fast content updates.",
        stats: [
          { label: "Stack", value: "Full" },
          { label: "Build time", value: "<2s" },
        ],
        pills: ["Next.js", "Strapi", "Tailwind", "SQLite"],
        tabs: [
          {
            label: "Portfolio",
            url: "github.com/MichaelWiss/ChefPortfolio",
            notes: [
              {
                label: "Architecture",
                body: "Two-app stack pairing Strapi v5 (SQLite) with a Next.js v15 frontend and Tailwind-backed component system for visually rich storytelling.",
              },
            ],
          },
          {
            label: "CMS",
            url: "github.com/MichaelWiss/ChefPortfolio",
            notes: [
              {
                label: "Architecture",
                body: "Strapi v5 content types for recipes, menus, and press features — all editable without a code deployment.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "printedPoster",
      title: "Printed Poster",
      industry: "Printed Poster",
      stack: "Shopify Headless Store",
      media: "/assets/img/printedPoster.webm",
      url: "https://printed-poster.vercel.app/",
      caseStudy: {
        eyebrow: "Shopify Headless · Next.js",
        description:
          "Production-ready Next.js storefront deployed to Vercel with custom product pages, cart flow, and collection filtering via the Shopify Storefront API.",
        stats: [
          { label: "Lighthouse", value: "98" },
          { label: "Deploy", value: "Vercel" },
        ],
        pills: ["Next.js", "Shopify", "Vercel", "App Router"],
        tabs: [
          {
            label: "Storefront",
            url: "printed-poster.vercel.app",
            notes: [
              {
                label: "Architecture",
                body: "App Router architecture with custom product pages, cart state management, and collection filtering. ISR for fast, CMS-editable pages.",
              },
            ],
          },
          {
            label: "PDP",
            url: "printed-poster.vercel.app/products/bauhaus-grid",
            notes: [
              {
                label: "Architecture",
                body: "Statically generated product pages with on-demand revalidation — instant loads with always-fresh Shopify inventory data.",
              },
            ],
          },
          {
            label: "Cart",
            url: "printed-poster.vercel.app/cart",
            notes: [
              {
                label: "Architecture",
                body: "Client-side cart state managed via React context with Shopify Storefront API mutations. Optimistic UI keeps the experience snappy.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "outrageousPayload",
      title: "Outrageous Payload",
      industry: "Outrageous Grocery Store",
      stack: "Payload Headless Store",
      media: "/assets/img/outrageousPayload.webm",
      url: "#",
      caseStudy: {
        eyebrow: "Payload CMS · Next.js",
        description:
          "Composable e-commerce platform using Payload CMS v3 as headless backend and Next.js 15 storefront with Stripe payment flows and a PostgreSQL schema.",
        stats: [
          { label: "CMS", value: "Payload v3" },
          { label: "Payments", value: "Stripe" },
        ],
        pills: ["Payload CMS", "Next.js", "Stripe", "PostgreSQL"],
        tabs: [
          {
            label: "Storefront",
            url: "outrageousgrocery.com",
            notes: [
              {
                label: "Architecture",
                body: "Defined core collections (Products, Variants, Orders) with content-block extensibility. Category filtering, rich product pages, and cart state management.",
              },
            ],
          },
          {
            label: "Admin CMS",
            url: "outrageousgrocery.com/admin",
            notes: [
              {
                label: "Architecture",
                body: "Payload v3 admin panel configured with custom access control, rich-text product descriptions, and variant relationship fields.",
              },
            ],
          },
          {
            label: "Checkout",
            url: "outrageousgrocery.com/checkout",
            notes: [
              {
                label: "Architecture",
                body: "Stripe payment intent flow with server-side order creation in Payload. Inventory decremented atomically on successful charge.",
              },
            ],
          },
        ],
      },
    },
    {
      id: "hubertsCraftCMS",
      title: "Huberts Crafts",
      industry: "Huberts Craft Store",
      stack: "Craft CMS Headless Store",
      media: "/assets/img/hubertsCraftCMS.webm",
      url: "#",
      caseStudy: {
        eyebrow: "Craft CMS · Next.js",
        description:
          "Full-stack e-commerce combining Craft CMS 4 + Craft Commerce 4 with a Next.js 14 storefront using Apollo Client, Zustand, and Tailwind + Radix UI.",
        stats: [
          { label: "API", value: "GraphQL" },
          { label: "State", value: "Zustand" },
        ],
        pills: ["Craft CMS", "Next.js", "GraphQL", "Zustand"],
        tabs: [
          {
            label: "Storefront",
            url: "hubertscraft.com",
            notes: [
              {
                label: "Architecture",
                body: "Schema-driven content via GraphQL with modular product components. CMS-editable experience bridging editorial flexibility with modern front-end architecture.",
              },
            ],
          },
          {
            label: "Product grid",
            url: "hubertscraft.com/collections/all",
            notes: [
              {
                label: "Architecture",
                body: "Apollo Client query with category facets sourced from Craft Commerce taxonomy. Zustand cart state persisted across navigation.",
              },
            ],
          },
          {
            label: "CMS",
            url: "hubertscraft.com/admin",
            notes: [
              {
                label: "Architecture",
                body: "Craft CMS 4 entry types for Products, Categories, and Editorial pages — all resolved through a unified GraphQL schema.",
              },
            ],
          },
        ],
      },
    },
  ],
  resume: {
    header: {
      name: "Michael Wiss",
      portfolioUrl: "https://michaelwiss.vercel.app/",
      title: "Web Developer",
      location: "Minneapolis, NY, Remote",
      links: [
        {
          url: "mailto:michael.wiss@gmail.com",
          text: "michael.wiss@gmail.com",
        },
        { text: "612-434-7463" },
        {
          url: "https://github.com/MichaelWiss",
          text: "github.com/MichaelWiss",
        },
        { text: "Download PDF", isButton: true },
      ],
    },
    experience: [
      {
        title: "Freelance Web Developer",
        company: "Independent Contractor",
        date: "2013 – Present",
        description:
          "Building modern web applications with React, TypeScript, and Next.js. Specializing in PWAs, e-commerce solutions, and headless CMS architectures with focus on performance and accessibility.",
        projects: [
          {
            name: "Payload CMS + Next.js E-Commerce Platform",
            url: "https://github.com/MichaelWiss/Payload",
            desc: "Composable e-commerce platform using Payload CMS v3 (Node.js/TypeScript) as headless backend and Next.js 15 (App Router) storefront, integrated with Stripe for payment flows. Defined core collections (Products, Variants, Categories, Orders) with content-block extensibility. Built category filtering, rich product pages with variants, cart state management, and SEO-friendly metadata. PostgreSQL schema with REST API endpoints, production-ready deployment on Vercel. Delivered unified content-commerce stack enabling rapid product onboarding and streamlined checkout UX with full CMS control.",
          },
          {
            name: "Custom Shopify Online Store 2.0 Theme — Commerce Engine",
            url: "https://github.com/MichaelWiss/shopify5LiquidJson",
            desc: "Developed a custom Shopify Online Store 2.0 theme using a full design-system approach with SCSS tokens, CSS custom properties, and modular JSON templates. Built a flexible section architecture with reusable Liquid components, an AJAX cart with variant logic, and improved mobile accessibility through WCAG-compliant interactions. The project highlights my ability to architect modern Shopify themes with clean Liquid structure, responsive design, and performant front-end behavior.",
          },
          {
            name: "CraftCMS — Full-stack E-Commerce Platform",
            url: "https://github.com/MichaelWiss/CraftCMS",
            desc: "Complete e-commerce system combining Craft CMS 4 + Craft Commerce 4 with Next.js 14 React storefront. Exposed products via GraphQL and custom REST API modules. TypeScript + Tailwind frontend using Apollo Client + Zustand for state management. Features full cart and checkout flows, schema-driven content, and modular product components. Delivered performant, CMS-editable commerce experience bridging editorial flexibility with modern front-end architecture.",
          },
          {
            name: "Chef Portfolio CMS — Strapi + Next.js Platform",
            url: "#",
            desc: "Two-app stack pairing Strapi v5 (SQLite) with Next.js v15 frontend and Tailwind-backed component system for visually rich storytelling.",
          },
          {
            name: "PrintedPoster — Shopify E-Commerce Storefront",
            url: "https://printed-poster.vercel.app/",
            desc: "Production-ready Next.js (App Router) storefront deployed to Vercel with custom product pages, cart flow, and collection filtering.",
          },
          {
            name: "HummingbirdPantry — Smart Pantry PWA",
            url: "#",
            desc: 'Multimodal, offline-first pantry manager with barcode scanning (ZXing), voice/camera hooks, and hardened dev setup (local HTTPS, secrets scanning, Playwright/Vitest). Modular React + TypeScript (Vite) architecture with Zustand and Tailwind + Radix UI for fast, testable feature work. Simplified item intake to "scan-and-stash," laying groundwork for AI-assisted lists and background sync.',
          },
          {
            name: "RunnersRotation — Shopify Hydrogen Storefront",
            url: "https://runners-rotation.vercel.app/",
            desc: "Modern Hydrogen storefront on Express + Vite with React Router 7, live Storefront API integration, and metafield-driven homepage hero.",
          },
          {
            name: "Dubrovnikcontemporary.com",
            url: "http://dubrovnikcontemporary.com",
            desc: "Gallery website featuring unobtrusive jQuery slideshows and custom Google Maps integration.",
            noHover: true,
          },
          {
            name: "Renovationyc.com",
            url: "http://renovationyc.com",
            desc: "WordPress CMS site with jQuery slideshow, mailing list sign-up, and contact form for rapid client updates.",
            noHover: true,
          },
          {
            name: "Linzinc.com",
            url: "http://linzinc.com",
            desc: "Rebuilt Flash experience with jQuery technologies, full e-commerce catalogue, and integrated blog + social APIs.",
            noHover: true,
          },
        ],
        skills: [
          "React",
          "TypeScript",
          "Next.js",
          "Shopify",
          "Gatsby",
          "JavaScript",
          "Node.js",
          "GraphQL",
          "Vite",
          "React Router",
          "PWA",
          "Strapi",
          "Craft CMS",
          "Payload CMS",
          "HTML5",
          "CSS3",
          "Tailwind",
          "WordPress",
        ],
      },
      {
        title: "Web Manager",
        company: "WhyHunger",
        date: "Aug 2012 – Mar 2013",
        description:
          "Maintained large Symphony and WordPress sites including blog.whyhunger and usfoodsovereigntyalliance. Delivered organization's first responsive fundraising experience.",
      },
      {
        title: "Assistant Manager",
        company: "Phaidon Bookstore",
        date: "2010 – 2011",
        description:
          "Led fine-art sales team generating $7k weekly revenue. Managed store operations and designed merchandising displays for discerning clientele.",
      },
      {
        title: "Sales Coordinator",
        company: "Miss K Greenhouses Inc.",
        date: "2006 – 2009",
        description:
          "Sold perennials, annuals, and tropicals at Union Square Greenmarket in NYC. Designed seasonal floor layouts and supervised customer service.",
      },
    ],
    technicalSkills: {
      frontend:
        "HTML5, CSS3, JavaScript, TypeScript, React, Vue, Responsive Design",
      backend: "Node.js, GraphQL, Gatsby, Shopify Hydrogen, Git, Strapi CMS",
      specializations:
        "E-Commerce, PWAs, API Integration, Performance Optimization",
    },
    education: {
      degree: "Bachelor of Fine Arts",
      school: "School of Visual Arts",
      year: "2004",
    },
  },
};
