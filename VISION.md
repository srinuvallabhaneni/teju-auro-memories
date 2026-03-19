# 💝 Teju & Auro — Forever Memories

## The Story
Srinu built a wedding website for his sister Tejasvi's wedding to Aurobindo on August 8, 2025. The wedding was beautiful — Sangeet, Haldi, and the Ceremony at Sunol's Casa Bella Event Center in the Bay Area.

Now the wedding is over, and this website transforms into something even more special: **a living memory book** — Srinu's gift to Teju & Auro as they begin their life together.

## What It Becomes

### 🏠 Home — "Our Story Continues"
- Beautiful hero with the couple's photo
- "X days since our wedding" warm counter (replacing countdown)
- Quick timeline preview of recent memories
- Warm welcome message

### 💒 Our Wedding Journey
- The three events preserved as gorgeous memory cards:
  - **Sangeet** (Aug 6) — The music, dance, and celebration
  - **Haldi** (Aug 7) — The sacred turmeric ceremony
  - **Wedding** (Aug 8) — The main ceremony at Casa Bella
- Each event card opens to a photo gallery
- Easy drag-drop photo upload for each event

### 📸 Photo Gallery
- All photos across all events and memories
- Masonry grid layout
- Full-screen photo viewer with swipe
- Filter by event/memory

### 🕐 Our Memories Timeline
- Vertical timeline starting from the wedding
- Each memory is a card with date, title, description, and photos
- Grows as they add life milestones:
  - First anniversary
  - First home
  - Travels together
  - Family milestones
  - Everyday beautiful moments

### ➕ Add Memory
- Simple, beautiful form
- Pick a date, add a title
- Write a description (or don't — photos speak)
- Upload photos from phone camera roll
- Tag with categories (Travel, Celebration, Milestone, Everyday, etc.)

### 💑 About Us
- The couple's story
- How they met
- Their journey to the wedding

## Design Language
Keeping the wedding site's warm, elegant aesthetic:
- **Warm beige** (#f5efe8) backgrounds
- **Dusty pink** (#B993A5) accents
- **Dark brown** (#39372b) text
- **Great Vibes** for decorative headings
- **Playfair Display** for titles
- **EB Garamond** for body text
- Floral watermarks preserved as decorative elements

## Storage Strategy

### Phase 1: Local Device Storage
- **IndexedDB** for photo blobs (efficient binary storage)
- **localStorage** for memory metadata (titles, dates, descriptions)
- Photos compressed to max 1920px width before storage
- Thumbnails generated at 300px for gallery grid
- **Limitation**: Data lives on one device only

### Phase 2: Cloud Sync (Future Vision)
- Firebase Realtime DB + Cloud Storage
- Only 2 authenticated users (Teju & Auro)
- Changes sync in real-time
- Photos auto-upload to cloud
- Works offline, syncs when connected
- Push notifications: "Auro added a new memory! 💕"

## The Gift
This isn't just an app. It's a brother saying:
> "Your wedding was beautiful. Now go build a beautiful life, and I've given you a place to keep every precious moment."
