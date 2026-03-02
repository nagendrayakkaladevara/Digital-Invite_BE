// Nagendra's AI - Wedding Assistant Context

export const WEDDING_INFO = {
  weddingDetails: {
    title: 'Sai Nagendra Weds Sushma',
    couple: 'Sai Nagendra & Sushma',
    mainWeddingDate: 'March 8th 2026 at 2:35 AM (early hours)',
    websiteUrl: 'https://sainagendra-weds-sushma.netlify.app',
    primaryLocations: {
      mamidikuduru: 'Mamidikuduru, Andhra Pradesh (16.52, 82.05)',
      weddingVenue: 'JSK Gardens, Eluru – Akkireddigudem Rd, beside BPCL (16.78, 81.08)',
      googleMaps: {
        mamidikuduru:
          'https://www.google.com/maps/search/Mamidikuduru+Andhra+Pradesh',
        jskGardens: 'https://share.google/rAaFsheiBXXCqXhlY',
      },
    },
  },
  weddingEvents: [
    { title: 'పెళ్లికొడుకు చేయటం', english: 'Groom Prep', date: 'March 5th Morning', location: 'Mamidikuduru' },
    { title: 'గోరింటాకు పెట్టటం', english: 'Mehndi', date: 'March 6th Morning', location: 'Mamidikuduru' },
    { title: 'గాజులు వేయటం', english: 'Bangles', date: 'March 6th Evening', location: 'Mamidikuduru' },
    { title: 'కాళ్ళ గోర్లు తీయటం', english: 'Toe Rings', date: 'March 7th Morning', location: 'Mamidikuduru' },
    { title: 'కంకణం కట్టటం', english: 'Kankanam', date: 'March 7th Morning', location: 'Mamidikuduru' },
    {
      title: 'పెళ్లికొడుకు ఇంటి దగ్గర విందు',
      english: 'Lunch',
      date: 'March 7th 11:30 AM onwards',
      location: 'Mamidikuduru',
    },
    { title: 'పెళ్లి', english: 'Wedding', date: 'March 8th 2:35 AM (early hours)', location: 'JSK Gardens, Eluru' },
    {
      title: 'శ్రీ సత్యనారాయణ స్వామి వ్రతం',
      english: 'Vratam',
      date: 'March 8th Morning',
      location: 'Mamidikuduru',
    },
  ],
  contacts: [
    { name: 'Prabhu', relation: 'Father', phone: '8099712349' },
    { name: 'Prasad', relation: 'Babaya', phone: '9014315333' },
    { name: 'Suresh', relation: 'Babaya', phone: '7013297510' },
    { name: 'Kasi Pavan', relation: 'Brother', phone: '9492533304' },
  ],
  travel: {
    mamidikuduruToJskGardens: {
      car: { duration: '2 hr 35 mins', distance: '129 km' },
      bike: { duration: '2 hr 30 mins', distance: '126 km' },
    },
    departureToWeddingVenue: 'On March 7th evening at 3:30 PM, people from Mamidikuduru will start traveling to JSK Gardens (పెళ్లి venue).',
  },
};

export function getWeddingContextString(): string {
  const { weddingDetails, weddingEvents, contacts, travel } = WEDDING_INFO;

  const locationsText = `
- Mamidikuduru: ${weddingDetails.primaryLocations.mamidikuduru}
- Wedding Venue (పెళ్లి): ${weddingDetails.primaryLocations.weddingVenue}
- Wedding website: ${weddingDetails.websiteUrl}
- Google Maps (Mamidikuduru): ${weddingDetails.primaryLocations.googleMaps.mamidikuduru}
- Google Maps (J S K Gardens): ${weddingDetails.primaryLocations.googleMaps.jskGardens}`;

  const travelText = `Mamidikuduru to JSK Gardens: by car ${travel.mamidikuduruToJskGardens.car.duration} (${travel.mamidikuduruToJskGardens.car.distance}), by bike ${travel.mamidikuduruToJskGardens.bike.duration} (${travel.mamidikuduruToJskGardens.bike.distance}). ${travel.departureToWeddingVenue}`;

  const eventsText = weddingEvents
    .map((e) => `- ${e.title} (${e.english}): ${e.date}, ${e.location}`)
    .join('\n');

  const contactsText = contacts
    .map((c) => `- ${c.name} (${c.relation}): ${c.phone}`)
    .join('\n');

  return `
Wedding details you know:
- Couple: ${weddingDetails.couple}
- Main wedding date: ${weddingDetails.mainWeddingDate}
- Website: ${weddingDetails.websiteUrl}
- Locations: ${locationsText}
- Travel: ${travelText}

Events schedule:
${eventsText}

Contact persons (for coordination):
${contactsText}
`.trim();
}

export function getWeddingSystemPrompt(): string {
  const weddingContext = getWeddingContextString();

  return `You are Nagendra's AI wedding assistant. Your role is to help users with this wedding: Sai Nagendra & Sushma.

IMPORTANT RULES:
1. When the user asks something WEDDING-RELATED but you don't have the information or it's beyond what you know (e.g., parking, accommodation, dress code, specific logistics not in the context), respond: "Nagendra is working on it."

2. When the user asks something NOT related to wedding (e.g., general knowledge, sports, jokes, other topics), first say: "Hey, this is not related to wedding, but I am a good person like Nagendra, I will answer." Then go ahead and answer their question helpfully.

3. For wedding questions you CAN answer from the context (venue, dates, events, locations, travel time/distance, departure timing, contacts, Google Maps links, website), provide a clear, helpful answer using the information given.

Here is the wedding information you know:
${weddingContext}`;
}
