/* =====================================================================
   JABIR FAVAS & VYSHNAVI BYJU — WEBSITE SETTINGS
   ---------------------------------------------------------------------
   This is the ONE file you edit to change names, wording, photos,
   contacts, music and the RSVP/wishes connection.

   PLACEHOLDERS: any text written inside square brackets, e.g.
   "[Add the year]", is treated as a placeholder. While
   showPlaceholders is true, placeholders appear on the page as small
   dashed tags so you can see what is still missing. Set it to false
   before sharing the link with guests and any unfilled placeholder
   is hidden automatically.

   PHOTOS: put image files in the /images folder and write the file
   name in the matching `src`, e.g. src: "images/bride.jpg".
   Leave src: "" to show the elegant placeholder frame instead.
   Recommended: JPG or WebP, about 1600px on the long side, under 400 KB.
   Optional `position` sets which part of the photo stays in view when it
   is cropped to the frame, e.g. position: "50% 20%" (left-right, top-bottom).
   ===================================================================== */

window.WEDDING = {
  showPlaceholders: false,

  couple: {
    bride: { first: "Vyshnavi", full: "Vyshnavi Byju" },
    groom: { first: "Jabir", full: "Jabir Favas" },
    monogram: "J & V",
    tagline: "Two different journeys. One life together."
  },

  /* ---------------- The two occasions ---------------- */
  registration: {
    date: "2027-01-30",
    dateLabel: "Saturday, 30 January 2027",
    title: "The Beginning of Forever",
    kind: "Marriage",
    description: "The day we make our promise to each other official, surrounded by the love and blessings of our closest family.",
    weekday: "Saturday", day: "30", month: "Jan", year: "2027",
    // Leave these as placeholders, or fill them in once confirmed.
    // An unconfirmed venue is never shown to guests when showPlaceholders is false.
    time: "[Add registration time]",
    venue: "[Add registration venue]",
    note: "Our registration ceremony",
    // Small figure beside the date: a doodle (art) or an image (src).
    figure: { src: "images/reg-hug.jpg", alt: "Illustration of Jabir and Vyshnavi hugging" }
  },

  reception: {
    date: "2027-01-31",
    dateLabel: "Sunday, 31 January 2027",
    // Start time used by the countdown and the calendar invite (India time, IST +05:30).
    start: "2027-01-31T14:00:00+05:30",
    // Calendar invites need an end time. Adjust when the schedule is confirmed.
    calendarEnd: "2027-01-31T18:00:00+05:30",
    timeLabel: "2:00 PM onwards",
    title: "Let’s Celebrate Love!",
    kind: "Wedding Reception",
    venueName: "Coir Retreat",
    venueArea: "Tirur, Kerala, India",
    venueNote: "A quiet retreat by the backwaters in Tirur, Malappuram district.",
    // Verified location: Coir Retreat, plus code VW45+W5W, Tirur, Kerala 676102.
    // If you have the venue's exact Google Maps share link (maps.app.goo.gl/…),
    // paste it into mapUrl to replace the search link.
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Coir%20Retreat%2C%20VW45%2BW5W%2C%20Tirur%2C%20Kerala%20676102",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Coir%20Retreat%2C%20VW45%2BW5W%2C%20Tirur%2C%20Kerala%20676102",
    calendarLocation: "Coir Retreat, VW45+W5W, Tirur, Kerala 676102, India",
    invitation: "A day filled with love, laughter, and the people who make life beautiful. As we begin this new chapter together, we would love to have our favourite people by our side, sharing smiles, creating memories, and making this beginning even more meaningful. We can’t wait to celebrate with you!",
    weekday: "Sunday", day: "31", month: "Jan", year: "2027",
    note: "Everyone is welcome · Come celebrate with us!",
    figure: { src: "images/rec-dance.jpg", alt: "Illustration of Jabir and Vyshnavi dancing" },
    audience: "Everyone is welcome",
    photo: { src: "images/venue.jpg", alt: "The banyan tree garden at Coir Retreat, Tirur", position: "60% 50%" }
  },

  /* ---------------- Photos ---------------- */
  photos: {
    opening: { src: "images/opening.jpg", alt: "Illustrated portrait of Jabir Favas and Vyshnavi Byju", position: "50% 8%" },
    hero:    { src: "images/hero.jpeg", alt: "Jabir Favas and Vyshnavi Byju together", position: "50% 76%" },
    bride:   { src: "images/bride.jpg", alt: "Portrait of Vyshnavi Byju", position: "62% 18%" },
    groom:   { src: "images/groom.jpeg", alt: "Portrait of Jabir Favas", position: "52% 15%" },
    note:    { src: "images/g-lamppost.jpg", alt: "Jabir and Vyshnavi in the garden", position: "45% 55%" },
    justMarried: { src: "images/just-married.jpg", alt: "Jabir and Vyshnavi driving off in a vintage car with a Just Married sign — See you on 31 January!" },
    closing: { src: "images/closing-lanterns.jpg", alt: "Jabir and Vyshnavi sitting together among flowers as lanterns float into the sky" }
  },

  /* ---------------- Our Story ---------------- */
  bride: {
    intro: "",
    about: "Gentle at heart and ambitious in life, she dreams of a life filled with love, purpose and little joys. She lets only a few people into her world, but those she loves mean everything to her.",
    facts: [
      { label: "Lights up when", value: "Surrounded by her favourite people, sharing laughter and making memories." },
      { label: "Dreams of", value: "A meaningful career, travelling the world and a beautiful life filled with love." },
      { label: "Quietly brilliant at", value: "Turning challenges into growth and finding beauty in little things." },
      { label: "Ask her about", value: "Love stories, big dreams, dream destinations and life’s little joys." }
    ]
  },
  groom: {
    intro: "",
    about: "Strong on the outside but soft at heart, he has a way of making everyone feel welcome. A friend to many, he finds joy in laughter, meaningful connections and creating beautiful memories with the people around him.",
    facts: [
      { label: "Lights up when", value: "Surrounded by his favourite people, sharing laughter and seeing them happy." },
      { label: "Dreams of", value: "Achieving his dreams, making his family proud and building a life filled with love." },
      { label: "Quietly brilliant at", value: "Staying strong, caring through actions and turning dreams into reality." },
      { label: "Ask him about", value: "Cars, dream drives, future plans and the love that changed his world." }
    ]
  },

  /* ---------------- Our Story timeline ----------------
     art: which doodle to show — "met", "online", "talk", "more" or "here".
     img: optional picture that replaces the doodle, e.g. img: "images/first-met.jpg". */
  storyIntro: "",
  timeline: [
    { art: "met",    img: "images/story-met.jpg",    title: "First Met",              text: "Same college, familiar faces, never knowing we would one day become each other’s favourite person." },
    { art: "met",    img: "images/story-familiar.jpg", title: "Familiar Faces",        text: "We crossed paths more than once, yet neither of us knew what life had quietly planned for us." },
    { art: "online", img: "images/story-online.jpg", title: "The First Conversation", text: "A simple beginning, a few words, and a curiosity that slowly grew into something special." },
    { art: "talk",   img: "images/story-closer.jpg", title: "Getting Closer",         text: "Little by little, we became part of each other’s days, sharing laughter, thoughts, and moments that started to mean more than we realised." },
    { art: "more",   img: "images/story-something-more.jpg", title: "Something More",         text: "Somewhere along the way, friendship turned into affection, and being together began to feel like home." },
    { art: "more",   img: "images/story-kiss.jpg",   title: "Choosing Each Other",    text: "Through every little moment, we found something worth holding on to — a love that made us choose each other, again and again." },
    { art: "here",   img: "images/story-forever.jpg", title: "Our Forever",            text: "What began as two separate journeys is now one beautiful story. And this is only the beginning of our forever." }
  ],
  storyClose: { names: "Jabir & Vyshnavi", line: "Somehow, somewhere, our forever began.",
    photo: { src: "images/forever-began.jpg", alt: "Jabir and Vyshnavi watching the sunset — Somehow, somewhere, our forever began." } },

  // Picture shown after the gallery
  galleryFinale: { src: "images/reg-photo.jpg", alt: "Illustration of Jabir and Vyshnavi laughing together", caption: "Collecting moments for a lifetime!", position: "50% 25%" },

  /* ---------------- Gallery ----------------
     Shown in this order as an even grid; the caption sits on each photo.
     thumb: small copy for the grid; src: full size for the enlarged view.
     position: which part of the photo stays in view when cropped to the tile.  */
  gallery: [
    { src: "images/gallery/mirror-selfie.jpg",        thumb: "images/gallery/mirror-selfie-thumb.jpg",        caption: "A little mirror moment",         position: "50% 35%" },
    { src: "images/gallery/02-our-selfie.jpg",        thumb: "images/gallery/02-our-selfie-thumb.jpg",        caption: "Our kind of selfie",             position: "35% 40%" },
    { src: "images/gallery/03-view-and-us.jpg",       thumb: "images/gallery/03-view-and-us-thumb.jpg",       caption: "Just a view and just us",        position: "42% 65%" },
    { src: "images/gallery/04-same-place.jpg",        thumb: "images/gallery/04-same-place-thumb.jpg",        caption: "Same place, new memories",       position: "28% 50%" },
    { src: "images/gallery/stone-chariot.jpg",        thumb: "images/gallery/stone-chariot-thumb.jpg",        caption: "Stories carved in stone",        position: "50% 70%" },
    { src: "images/gallery/06-laughing-together.jpg", thumb: "images/gallery/06-laughing-together-thumb.jpg", caption: "Laughing together",              position: "45% 45%" },
    { src: "images/gallery/love-purest-form.jpg",     thumb: "images/gallery/love-purest-form-thumb.jpg",     caption: "Love in its purest form",        position: "50% 40%" },
    { src: "images/gallery/07-sunset-drives.jpg",     thumb: "images/gallery/07-sunset-drives-thumb.jpg",     caption: "Sunset drives",                  position: "45% 70%" },
    { src: "images/gallery/08-coffee-at-top.jpg",     thumb: "images/gallery/08-coffee-at-top-thumb.jpg",     caption: "Coffee at top",                  position: "50% 62%" },
    { src: "images/gallery/golden-skies.jpg",         thumb: "images/gallery/golden-skies-thumb.jpg",         caption: "Golden skies & quiet walks",     position: "50% 95%" },
    { src: "images/gallery/09-flowers-above.jpg",     thumb: "images/gallery/09-flowers-above-thumb.jpg",     caption: "Flower above, love beside",      position: "50% 85%" },
    { src: "images/gallery/10-holding-on.jpg",        thumb: "images/gallery/10-holding-on-thumb.jpg",        caption: "Holding on, laughing along",     position: "35% 60%" }
  ],

  /* ---------------- Music ----------------
     Put audio files in /music and list them in playlist. Each visit
     starts on a random song, then plays the rest in order; guests can
     skip with the previous/next buttons. Only use music you have
     permission to use. While the playlist is empty, a short original
     music-box melody (made for this site, free to use) plays instead.  */
  music: {
    playlist: [
      // lang: songs are mixed so the same language never plays twice in a row
      { src: "music/night-changes.mp3",     title: "Night Changes",     artist: "One Direction",                lang: "English" },
      { src: "music/a-thousand-years.mp3",  title: "A Thousand Years",  artist: "Christina Perri",              lang: "English" },
      { src: "music/belongs-together.mp3",  title: "Belong Together",   artist: "Mark Ambor",                   lang: "English" },
      { src: "music/dandelions.mp3",        title: "Dandelions",        artist: "Ruth B.",                      lang: "English" },
      { src: "music/her.mp3",               title: "Her",               artist: "JVKE",                         lang: "English" },
      { src: "music/ordinary.mp3",          title: "Ordinary",          artist: "Alex Warren",                  lang: "English" },
      { src: "music/janam-janam.mp3",       title: "Janam Janam",       artist: "Arijit Singh & Antara Mitra",  lang: "Hindi" },
      { src: "music/jeena-jeena.mp3",       title: "Jeena Jeena",       artist: "Atif Aslam",                   lang: "Hindi" },
      { src: "music/kabira.mp3",            title: "Kabira",            artist: "Tochi Raina & Rekha Bhardwaj", lang: "Hindi" },
      { src: "music/mitwa.mp3",             title: "Mitwa",             artist: "Shafqat Amanat Ali",           lang: "Hindi" },
      { src: "music/hridayathin.mp3",       title: "Hridayathin Niramayi", artist: "Mridula Warrier & Vijay Yesudas", lang: "Malayalam" },
      { src: "music/neelambalin.mp3",       title: "Neelambalin",       artist: "Arun Alat & Kavya Ajit",       lang: "Malayalam" },
      { src: "music/vathil-melle.mp3",      title: "Vaathil Melle",     artist: "Rajesh Murugan & Sachin Warrier", lang: "Malayalam" },
      { src: "music/kadhalaade.mp3",        title: "Kadhalaada",        artist: "Pradeep Kumar & Shashaa Tirupati", lang: "Tamil" },
      { src: "music/aaromal.mp3",           title: "Aaromal",           artist: "Vishal Chandrashekhar & Sooraj Santhosh", lang: "Malayalam" },
      { src: "music/aval.mp3",              title: "Aval",              artist: "Santhosh Narayanan & Pradeep Kumar", lang: "Tamil" },
      { src: "music/mazhavillaye.mp3",      title: "Mazhavillaye",      artist: "Jakes Bejoy & Armaan Malik",   lang: "Malayalam" },
      { src: "music/un-vizhigalil.mp3",     title: "Un Vizhigalil",     artist: "G. V. Prakash & Harini",       lang: "Tamil" },
      { src: "music/aradhya.mp3",           title: "Aradhya",           artist: "Chinmayi, Hesham Abdul Wahab & Sid Sriram", lang: "Telugu" }
    ],
    fallbackTitle: "Two Journeys",
    fallbackArtist: "Music-box sketch · placeholder until you choose your song",
    playOnOpen: true
  },

  /* ---------------- A Note From Us ---------------- */
  note: [
    "As we get ready to begin this beautiful new chapter, our hearts are full of happiness, gratitude, and a little excitement for everything that lies ahead. We feel so lucky to have found each other, and even luckier to have people like you who have been part of our lives and our journey.",
    "As we take this special step towards a lifetime together, we find ourselves wishing for one simple thing — to share this happiness with the people who mean the most to us.",
    "Your presence, your smiles, and your blessings would make these moments even more beautiful. After all, the best memories are the ones we get to share with the people we love.",
    "We can’t wait to bring everyone together, celebrate this new beginning, and create beautiful memories that we will carry in our hearts forever."
  ],
  noteSignoff: "With all our love,",

  /* ---------------- Need Help? ----------------
     phone: full international number with country code, digits only
     after the +, e.g. "+919876543210". whatsapp: true adds a WhatsApp button. */
  contacts: [
    { group: "Groom", people: [
      { name: "Jabir Favas", phone: "+91 70124 34256" }
    ]},
    { group: "Bride", people: [
      { name: "Vyshnavi Byju", phone: "+91 70250 13926" }
    ]}
  ],
  contactsNote: "Or just ping us, we probably won’t miss it!",

  /* ---------------- RSVP & Wishes connection ----------------
     backendUrl: the Google Apps Script web-app URL (see README, step 3).
       Wishes are then saved to your Google Sheet: "Everyone" wishes glow as
       lanterns for all guests; "Only the couple" wishes appear only for you,
       after you open the site once with ?couple=<your COUPLE_KEY> (README).
     whatsappNumber: used as a working fallback while backendUrl is empty
       (or if it cannot be reached): the guest's RSVP or wish opens as a
       ready-to-send WhatsApp message to this number.
       Digits only with country code, e.g. "919876543210".  */
  backendUrl: "https://script.google.com/macros/s/AKfycbz1FzFZfW7PnE1vW9oUmqT76XzM7kHl6IaTF4CIUeJnnzdn6MkromHu4_z0Mo4PwwLG/exec",
  whatsappNumber: "917025013926",
  rsvpOptional: true   // shows "Everyone is welcome — RSVP just helps us plan"
};
