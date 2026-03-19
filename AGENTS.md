# Teju & Auro — Forever Memories App

## Project Vision
Transform the wedding website for **Tejasvi & Aurobindo** into a beautiful **memorial/remembrance app** — a gift from brother (Srinu) to sister (Teju). The wedding (Aug 8, 2025) is now over. This app preserves those precious moments and grows with the couple as they build new life memories together.

## Architecture

### Tech Stack
- **Framework**: React 19 + Vite 6 (keeping existing stack)
- **Styling**: Tailwind CSS 3 (keeping existing)
- **Routing**: React Router v7 (keeping existing)
- **Storage**: Browser localStorage + IndexedDB (via `idb` library) for photos
- **Future**: Cloud sync (Phase 2) for cross-device sharing between Teju & Auro

### App Structure
```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Router + layout
├── index.css                   # Global styles
├── contexts/
│   └── MemoryContext.jsx       # Global state for memories & photos
├── hooks/
│   └── useLocalStorage.js      # Persistent state hook
│   └── useIndexedDB.js         # Photo storage hook
├── components/
│   ├── Navbar.jsx              # Updated nav for memorial app
│   ├── Slideshow.jsx           # Photo carousel (enhanced)
│   ├── DecorWindow.jsx         # Decorative wrapper (keep)
│   ├── PhotoUploader.jsx       # Drag-drop photo upload
│   ├── PhotoGallery.jsx        # Grid/masonry photo gallery
│   ├── MemoryCard.jsx          # Individual memory display card
│   ├── MemoryForm.jsx          # Add/edit memory form
│   ├── Timeline.jsx            # Vertical timeline component
│   └── FloatingActionButton.jsx # Quick-add memory FAB
├── pages/
│   ├── Home.jsx                # Landing: couple hero + timeline preview
│   ├── WeddingJourney.jsx      # The 3 wedding events (Sangeet/Haldi/Wedding)
│   ├── EventGallery.jsx        # Photos for a specific wedding event
│   ├── Memories.jsx            # Timeline of all life memories
│   ├── NewMemory.jsx           # Add new life memory page
│   ├── MemoryDetail.jsx        # Single memory view with photos
│   ├── Gallery.jsx             # Full photo gallery across all events
│   └── About.jsx               # The couple's story
├── data/
│   └── weddingEvents.js        # Static wedding event data (extracted from old pages)
├── utils/
│   ├── storage.js              # localStorage/IndexedDB helpers
│   ├── imageUtils.js           # Image compression/thumbnail generation
│   └── dateUtils.js            # Date formatting helpers
└── assets/                     # Existing wedding images (preserved)
```

### Pages Transformation Map
| Old Page | New Purpose |
|----------|------------|
| Home | Hero landing with "days since wedding" counter + timeline preview |
| Schedule → WeddingJourney | Preserved wedding events as beautiful memory cards |
| RSVP → *removed* | No longer needed |
| Hotels → *removed* | No longer needed |
| CarRentals → *removed* | No longer needed |
| Attractions → *removed* | No longer needed (was for guests visiting) |
| Registry → *removed* | No longer needed |
| *new* → Memories | Timeline of life memories (wedding + future) |
| *new* → NewMemory | Add new memory with photos, date, description |
| *new* → Gallery | Full photo gallery across all events/memories |
| *new* → About | The couple's love story |

## Design Philosophy
- **Warm & Intimate**: Keep the existing color palette (#f5efe8 beige, #B993A5 dusty pink, #39372b brown)
- **Photo-First**: Photos are the heart of every memory
- **Easy to Use**: Teju & Auro should be able to add memories with minimal effort
- **Mobile-First**: They'll primarily use phones to add photos/memories
- **Sentimental**: Countdown becomes "days since our wedding", preserving the romantic tone

## Phases

### Phase 1 — Core Memorial App (Current Sprint)
- [x] Preserve all existing wedding photos/assets
- [ ] Transform Home page (hero + "days married" counter)
- [ ] Create WeddingJourney page (the 3 events as memory cards)
- [ ] Build photo upload + gallery for each wedding event
- [ ] Create Memories timeline page
- [ ] Build NewMemory page (add date, title, description, photos)
- [ ] Build MemoryDetail page
- [ ] Create Gallery page (all photos)
- [ ] Create About page (couple's story)
- [ ] Update Navbar for new navigation
- [ ] IndexedDB storage for photos (phone storage)
- [ ] Image compression before storage

### Phase 2 — Polish & Delight
- [ ] Animated transitions between pages
- [ ] Photo slideshow mode for each event/memory
- [ ] Memory cards with beautiful date formatting
- [ ] Share individual memories (generate shareable image)
- [ ] Anniversary reminders & milestones

### Phase 3 — Cloud Sync (Future)
- [ ] Firebase/Supabase backend for sync
- [ ] Auth for Teju & Auro (just 2 users)
- [ ] Real-time photo sync between devices
- [ ] Shared editing of memories
- [ ] Push notifications for new memories added by partner

## Code Conventions
- React functional components with hooks
- Tailwind CSS for all styling (no CSS modules)
- Keep existing font stack: Playfair Display, EB Garamond, Dancing Script, Great Vibes
- Keep existing color palette and warm aesthetic
- Mobile-first responsive design
- All photos stored as compressed blobs in IndexedDB
- Metadata (memory titles, dates, descriptions) in localStorage

## Key Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Lint check
```

## Current Status
🟢 **Phase 1 — Complete**: Core memorial app built
🟢 **Phase 2 — Complete**: Polish & Delight
- Fixed 6 integration bugs (component prop APIs, photo URL conversion, named exports)
- PWA support: manifest.json, service worker, installable on phones
- Page transitions (fade-in + slide-up on route change)
- Scroll-to-top on navigation
- Tailwind font aliases fixed (font-dancing)
- CSS cleanup (removed dark theme defaults, warm beige throughout)
- All 7 routes verified in browser

🔜 **Phase 3 — Future**: Cloud sync (Firebase/Supabase for Teju & Auro to share)
