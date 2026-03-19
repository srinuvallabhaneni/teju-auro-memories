/**
 * Wedding event data and couple information.
 * Extracted from the original Schedule page for use across the memorial/remembrance app.
 */

export const COUPLE_INFO = {
  bride: 'Tejasvi Vallabhaneni',
  groom: 'Aurobindo Sonti',
  weddingDate: '2025-08-08',
  venue: "Sunol's Casa Bella Event Center",
};

export const WEDDING_EVENTS = [
  {
    id: 'sangeet',
    name: 'Sangeet',
    date: '2025-08-06',
    startTime: '6:00 PM',
    endTime: '10:00 PM',
    venue: 'Shubham Halls',
    address: '1214 Apollo Way, Sunnyvale, CA 94085',
    mapsUrl: 'https://maps.google.com/?q=1214+Apollo+Way,+Sunnyvale,+CA+94085',
    description:
      'Saitejasvi & Aurobindo Sangeet Celebration - an evening of music, dance, and joy.',
    iconType: 'sangeet',
    photoAlbumId: 'album-sangeet',
  },
  {
    id: 'haldi',
    name: 'Haldi',
    date: '2025-08-07',
    startTime: '8:00 AM',
    endTime: '10:00 AM',
    venue: 'Residence',
    address: '835 Tolentino Ct, Livermore, CA 94550',
    mapsUrl: 'https://maps.google.com/?q=835+Tolentino+Ct,+Livermore,+CA+94550',
    description:
      'Haldi ceremony followed by lunch - a traditional turmeric blessing ritual.',
    iconType: 'haldi',
    photoAlbumId: 'album-haldi',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    date: '2025-08-08',
    startTime: '8:00 AM',
    endTime: '1:30 PM',
    venue: "Sunol's Casa Bella Event Center",
    address: '11984 Main Street, Sunol, CA 94586',
    mapsUrl: 'https://maps.google.com/?q=11984+Main+Street,+Sunol,+CA+94586',
    description:
      'Wedding ceremony and reception - the beginning of a beautiful journey together.',
    iconType: 'wedding',
    photoAlbumId: 'album-wedding',
  },
];

/**
 * Get a single event by its id.
 * @param {string} id - Event id ('sangeet' | 'haldi' | 'wedding')
 * @returns {object|undefined}
 */
export const getEventById = (id) => WEDDING_EVENTS.find((e) => e.id === id);

export default WEDDING_EVENTS;
