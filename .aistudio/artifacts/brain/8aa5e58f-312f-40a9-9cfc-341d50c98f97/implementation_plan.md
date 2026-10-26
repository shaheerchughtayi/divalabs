# DIVA LABS — Luxury Digital Authority & Storefront

An executive-tier digital asset storefront, masterclass catalog, and secure checkout platform built with a luxury Charcoal & Bronze/Gold aesthetic, featuring subtle gold particle motion, dynamic product management, modal previews, manual JazzCash delivery workflows, and an authenticated hidden admin dashboard.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and user experience decisions have been aligned based on user clarification and design specifications:

- **Hidden Admin Access**: Accessible via secret route (`/admin` and URL hash `#admin`) and an unobtrusive subtle keyhole trigger in the footer (no public navbar button for normal visitors).
- **Initial Catalog State**: Starts with an empty catalog as confirmed by the user, featuring an elegant luxury empty-state message and an optional one-click "Load Blueprint Templates" tool inside the Admin Control Panel for quick testing.
- **Zero-Friction Unified Persistence**: Built with a seamless server-backed storage endpoint (`/api/data`) coupled with client `localStorage` caching. Admins can add products, update prices, alter JazzCash numbers/instructions, and upload QR codes with instant live persistence across sessions and browsers with zero manual database configuration.
- **Visual Exactness to Provided References**: Matches the provided visual screenshots with dark obsidian `#0c0c0e` backdrop, floating golden particle embers, flowing elite wave canvas, glassmorphic floating pill navbar, and glowing bronze borders (`#b38b4d` / `#dfb776`).

---

## 1. Overview & Core Concept

**DIVA LABS** is a high-end digital authority offering roadmaps, exclusive cybersecurity blueprints, and advanced tech arsenals. 

- **Target Persona**: Elite developers, cybersecurity researchers, digital strategists, and executive professionals seeking premium masterclasses and digital arsenals.
- **Key Value**: Provides an ultra-clean, minimalist luxury presentation that commands authority, paired with a reliable manual payment flow (JazzCash + Instagram verification) tailored for direct digital delivery via Google Drive links.
- **Store Administrator**: Empowered with a full management cockpit to control products, pricing, checkout instructions, QR code visibility, and credentials without editing source code.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Home Experience (`/`)**:
   - Floating glassmorphic top navigation pill: `[ 🏠 HOME ]` | `[ PRODUCTS ]` | `[ CHECKOUT ]`.
   - Brand title **"DIVA LABS"** in bronze/gold metallic gradient typography.
   - Main slogan: **"DOMINATE THE MODERN ERA"** with crisp typography.
   - Authority sub-text and glowing bronze-bordered **"EXPLORE PRODUCTS"** CTA directing seamlessly to the store.
   - Ambient luxury canvas: dark charcoal/obsidian gradient with animated floating gold dust particles and slow-moving wave graphics.

2. **Products Catalog (`/products` or `#products`)**:
   - Page Header: *"OUR ELITE DIGITAL ASSETS & ROADMAPS"* with subtitle *"Choose your weapon and start mastering today."*
   - Responsive multi-column grid of luxury product cards:
     - Rectangular dark visual placeholder/container with custom icon badges or uploaded graphics.
     - Product title, price formatted in Pakistani Rupees (`Rs. XXX`).
     - Smooth card elevation hover states with expanding bronze glow.
     - Interactive **"See Details"** button opening the Product Detail Modal.
     - Direct **"Buy Now / Access Now"** button routing immediately into Checkout with the selected product pre-loaded.

3. **Product Details Modal**:
   - High-contrast luxury modal with backdrop blur.
   - Rectangular asset graphic banner at top, left-aligned title, formatted masterclass/blueprint syllabus details, and price.
   - Full-width bronze gradient **"BUY NOW / ACCESS NOW"** button routing to checkout.

4. **Secure Checkout & Manual Delivery (`/checkout` or `#checkout`)**:
   - Header: *"SECURE CHECKOUT & MANUAL DELIVERY"*.
   - Stylized dark container with glowing bronze border displaying the chosen product and price.
   - Payment Details Box: JazzCash Account Title and Account Number with one-click copy buttons.
   - Clear 3-step instructions:
     - *Step 1:* Send payment via JazzCash to the displayed account.
     - *Step 2:* Take screenshot and send on Instagram `@diva.ltd` with Transaction ID & product name.
     - *Step 3:* Receive Google Drive access link.
   - Interactive QR Code toggle switch: when ON, displays the admin-uploaded JazzCash QR code frame; when OFF, smoothly collapses.

5. **Hidden Admin Dashboard (`/admin` or `#admin`)**:
   - Password authentication barrier with configurable admin email/password.
   - **Tab / Column 1 — Manage Products**: Real-time product list with [Edit] and [Delete] actions, plus "Add New Product" form (Title, Short Description, Full Syllabus, Price Rs., Rectangular Image / Icon selection).
   - **Tab / Column 2 — Edit Checkout Instructions**: Live fields for JazzCash Title, JazzCash Number, Step 1, Step 2, and Step 3 instructions with instant save.
   - **Tab / Column 3 — Manage QR Code & Settings**: Toggle switch for checkout QR visibility, live image preview, Upload New QR (via file reader or URL), Remove QR, and Admin credential update settings.

### Visual Identity & Theme Tokens

- **Dominant Neutral Canvas (60%)**: Deep obsidian `#0a0a0c`, dark charcoal `#121216`, and surface black `#18181d`.
- **Structural Surfaces & Hairlines (30%)**: Translucent obsidian panels with glassmorphism backdrop blur (`rgba(22, 22, 28, 0.75)`), delicate bronze borders (`rgba(197, 155, 87, 0.28)`), and soft drop shadows.
- **Luxury Bronze/Gold Accent Budget (10%)**:
  - Primary Bronze: `#c59b57` (Linear gradient: `linear-gradient(135deg, #dfb776 0%, #b38b4d 50%, #87652e 100%)`).
  - Glowing halo accents: `rgba(212, 175, 55, 0.18)` on hover and active states.
  - Typography: Metallic title gradient (`bg-clip-text text-transparent bg-gradient-to-r from-[#dfb776] via-[#f7e7c4] to-[#b38b4d]`).

---

## 3. Key Product Decisions & Trade-Offs

- **Single-Page Dynamic Routing with Multi-Page Simulation**:
  - *Decision*: Build with client-side view routing (`home`, `products`, `checkout`, `admin`) synchronized with browser URL paths and hash states, ensuring instant navigation without full-page reloads while maintaining discrete page URLs (`index.html`, `store.html`, `checkout.html`, `admin.html` mappings).
  - *Why*: Provides fluid, instant zero-latency page transitions while keeping the background gold particle canvas uninterrupted.
- **Hybrid Persistent Storage (`/api/data` + LocalStorage)**:
  - *Decision*: Provide an Express backend API route (`GET /api/diva/data`, `POST /api/diva/data`) with local JSON backup on server and browser `localStorage` mirror.
  - *Why*: Ensures admin updates immediately reflect for any visitor, survive reloads, and work flawlessly even if offline or before network sync.
- **Canvas-Driven Gold Ambient Particles**:
  - *Decision*: Lightweight HTML5 `<canvas>` rendering 40–50 floating warm golden light motes with physics drift and alpha twinkle, plus SVG flowing wave underlays.
  - *Why*: Ultra-performant (60 FPS, <1% CPU), no external heavy libraries, pure elegance matching user screenshots.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DIVA LABS APPLICATION                         │
├────────────────────────────────────────────────────────────────────────┤
│  [ Ambient Canvas: Gold Particle Twinkle + Flowing Elite Wave Lines ]  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Floating Glassmorphism Navbar: [ 🏠 HOME ] [ PRODUCTS ] [ CHECKOUT]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│          ┌─────────────────────┼─────────────────────┐                 │
│          ▼                     ▼                     ▼                 │
│   ┌──────────────┐     ┌──────────────┐      ┌──────────────┐          │
│   │  Home View   │     │ Products View│      │Checkout View │          │
│   │  (Slogan &   │     │ (Grid & Modal│      │ (JazzCash &  │          │
│   │  Brand CTA)  │     │  Details)    │      │  QR Switch)  │          │
│   └──────────────┘     └──────────────┘      └──────────────┘          │
│                                                      ▲                 │
│                                                      │                 │
│   ┌──────────────────────────────────────────────────┴──────────────┐  │
│   │ Hidden Admin Dashboard (/admin & footer trigger)                │  │
│   │  • Auth Shield (Email + Password)                               │  │
│   │  • Product Manager (Add / Edit / Delete / Image Upload)         │  │
│   │  • Checkout Instructions Editor (JazzCash Details)              │  │
│   │  • QR Code Switch & Uploader                                    │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│                                ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ State Store (Local Storage Mirror + Server Persistent API)      │  │
│   └─────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & State Structure

```typescript
interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  priceRs: number;
  imageUrl?: string;
  badge?: string;
  createdAt: number;
}

interface CheckoutSettings {
  accountTitle: string;
  accountNumber: string;
  step1: string;
  step2: string;
  step3: string;
  showQrCode: boolean;
  qrCodeUrl?: string;
  instagramHandle: string;
}

interface AdminAuth {
  email: string;
  passwordHashOrKey: string;
  sessionToken?: string;
}
```

### Interactive Component & State Mapping

- **Product Catalog State**: React hook reading from persistent store. When products array is empty, renders luxury empty slate with an Admin shortcut to seed or create. When populated, renders 2-column or 3-column responsive luxury grid.
- **Product Modal State**: Selecting "See Details" opens modal with focus trap, ESC key close, and "Buy Now" handler pre-populating checkout.
- **Checkout State**: Observes selected product (if any), computes total, provides one-click copy buttons for JazzCash number and Instagram message template, and toggles QR code image view with smooth height transition.
- **Admin Control Panel**: Guarded by state authentication. Contains active editing forms, instant image file-to-DataURL reader for zero-friction image uploads, and instant live preview updates across the entire site.
