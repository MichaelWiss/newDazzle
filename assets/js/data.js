/**
 * Site Data Configuration
 * Edit this file to update site content dynamically.
 */

export const SiteData = {
    dazzle: {
        text: `Michael Wiss is a creative web developer in New York City that makes everything DAZZLING. We make work across all mediums and platforms: branding, digital, motion, illustration, environmental, print, packaging & more.`,
        colors: [
            '#ff5ca8', // Hot Pink
            '#ffbd2e', // Marigold
            '#2bf65d', // Neon Green
            '#05d5ff', // Cyan
            '#a855f7', // Purple
            '#ff5ca8'  // Loop back to Pink
        ]
    },
    projects: [
        { 
            id: 'runners-rotation', 
            title: 'Runners Rotation', 
            client: 'Personal Project', 
            service: 'Shopify Headless Store',
            media: '/assets/img/runnersRotation.webm',
        },
        { 
            id: 'Hummingbird-Pantry', 
            title: "Hummingbird Pantry", 
            client: 'Pantry App', 
            service: 'Web Application',
            media: '/assets/img/hummingbirdPantry.webm', 
        },
        { 
            id: 'refinements', 
            title: 'Refinements', 
            client: 'Personal Project', 
            service: 'Shopify Custom Theme',
            media: '/assets/img/refinements1.webm', 
        },
        { 
            id: 'american-negro-art', 
            title: 'American Negro Art', 
            client: 'Cedric Dover', 
            service: 'Full Stack Dev',
            media: '/assets/img/chefPortfoli.webm',
        }
    ],
    resume: {
        header: {
            name: "Michael Wiss",
            title: "Web Developer",
            location: "Minneapolis, NY, Remote",
            links: [
                { url: "mailto:michael.wiss@gmail.com", text: "michael.wiss@gmail.com" },
                { text: "612-434-7463" },
                { url: "https://github.com/MichaelWiss", text: "github.com/MichaelWiss" },
                { text: "Download PDF", isButton: true }
            ]
        },
        experience: [
            {
                title: "Freelance Web Developer",
                company: "Independent Contractor",
                date: "2013 – Present",
                description: "Building modern web applications with React, TypeScript, and Next.js. Specializing in PWAs, e-commerce solutions, and headless CMS architectures with focus on performance and accessibility.",
                projects: [
                    { name: "Payload CMS + Next.js E-Commerce Platform", url: "https://github.com/MichaelWiss/Payload", desc: "Composable e-commerce platform using Payload CMS v3 (Node.js/TypeScript) as headless backend and Next.js 15 (App Router) storefront, integrated with Stripe for payment flows. Defined core collections (Products, Variants, Categories, Orders) with content-block extensibility. Built category filtering, rich product pages with variants, cart state management, and SEO-friendly metadata. PostgreSQL schema with REST API endpoints, production-ready deployment on Vercel. Delivered unified content-commerce stack enabling rapid product onboarding and streamlined checkout UX with full CMS control." },
                    { name: "Custom Shopify Online Store 2.0 Theme — Commerce Engine", url: "https://github.com/MichaelWiss/shopify5LiquidJson", desc: "Developed a custom Shopify Online Store 2.0 theme using a full design-system approach with SCSS tokens, CSS custom properties, and modular JSON templates. Built a flexible section architecture with reusable Liquid components, an AJAX cart with variant logic, and improved mobile accessibility through WCAG-compliant interactions. The project highlights my ability to architect modern Shopify themes with clean Liquid structure, responsive design, and performant front-end behavior." },
                    { name: "CraftCMS — Full-stack E-Commerce Platform", url: "https://github.com/MichaelWiss/CraftCMS", desc: "Complete e-commerce system combining Craft CMS 4 + Craft Commerce 4 with Next.js 14 React storefront. Exposed products via GraphQL and custom REST API modules. TypeScript + Tailwind frontend using Apollo Client + Zustand for state management. Features full cart and checkout flows, schema-driven content, and modular product components. Delivered performant, CMS-editable commerce experience bridging editorial flexibility with modern front-end architecture." },
                    { name: "Chef Portfolio CMS — Strapi + Next.js Platform", url: "#", desc: "Two-app stack pairing Strapi v5 (SQLite) with Next.js v15 frontend and Tailwind-backed component system for visually rich storytelling." },
                    { name: "PrintedPoster — Shopify E-Commerce Storefront", url: "#", desc: "Production-ready Next.js (App Router) storefront deployed to Vercel with custom product pages, cart flow, and collection filtering." },
                    { name: "HummingbirdPantry — Smart Pantry PWA", url: "#", desc: "Multimodal, offline-first pantry manager with barcode scanning (ZXing), voice/camera hooks, and hardened dev setup (local HTTPS, secrets scanning, Playwright/Vitest). Modular React + TypeScript (Vite) architecture with Zustand and Tailwind + Radix UI for fast, testable feature work. Simplified item intake to \"scan-and-stash,\" laying groundwork for AI-assisted lists and background sync." },
                    { name: "RunnersRotation — Shopify Hydrogen Storefront", url: "#", desc: "Modern Hydrogen storefront on Express + Vite with React Router 7, live Storefront API integration, and metafield-driven homepage hero." },
                    { name: "Dubrovnikcontemporary.com", url: "http://dubrovnikcontemporary.com", desc: "Gallery website featuring unobtrusive jQuery slideshows and custom Google Maps integration.", noHover: true },
                    { name: "Renovationyc.com", url: "http://renovationyc.com", desc: "WordPress CMS site with jQuery slideshow, mailing list sign-up, and contact form for rapid client updates.", noHover: true },
                    { name: "Linzinc.com", url: "http://linzinc.com", desc: "Rebuilt Flash experience with jQuery technologies, full e-commerce catalogue, and integrated blog + social APIs.", noHover: true }
                ],
                skills: ["React", "TypeScript", "Next.js", "Shopify", "Gatsby", "JavaScript", "Node.js", "GraphQL", "Vite", "React Router", "PWA", "Strapi", "Craft CMS", "Payload CMS", "HTML5", "CSS3", "Tailwind", "WordPress"]
            },
            {
                title: "Web Manager",
                company: "WhyHunger",
                date: "Aug 2012 – Mar 2013",
                description: "Maintained large Symphony and WordPress sites including blog.whyhunger and usfoodsovereigntyalliance. Delivered organization's first responsive fundraising experience."
            },
            {
                title: "Assistant Manager",
                company: "Phaidon Bookstore",
                date: "2010 – 2011",
                description: "Led fine-art sales team generating $7k weekly revenue. Managed store operations and designed merchandising displays for discerning clientele."
            },
            {
                title: "Sales Coordinator",
                company: "Miss K Greenhouses Inc.",
                date: "2006 – 2009",
                description: "Sold perennials, annuals, and tropicals at Union Square Greenmarket in NYC. Designed seasonal floor layouts and supervised customer service."
            }
        ],
        technicalSkills: {
            frontend: "HTML5, CSS3, JavaScript, TypeScript, React, Vue, Responsive Design",
            backend: "Node.js, GraphQL, Gatsby, Shopify Hydrogen, Git, Strapi CMS",
            specializations: "E-Commerce, PWAs, API Integration, Performance Optimization"
        },
        education: {
            degree: "Bachelor of Fine Arts",
            school: "School of Visual Arts",
            year: "2004"
        }
    }
};
