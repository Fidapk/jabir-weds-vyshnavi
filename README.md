# Jabir Favas & Vyshnavi Byju — Wedding Website

A complete, mobile-first wedding invitation site: opening envelope, countdown, our story, the two celebrations, RSVP, gallery with lightbox, music player, personal note, wishes wall, help contacts and closing.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `js/config.js` | **All wording, photos, contacts, music and the RSVP connection** | Yes — this is the main file |
| `index.html` | Page structure and section headings | Only to change headings |
| `css/style.css` | Colours (top of file), fonts, layout | Colours at the top, if you like |
| `js/app.js` | How everything works | No |
| `backend/Code.gs` | Google Sheets backend for RSVPs and wishes | Paste into Apps Script (step 3) |
| `images/`, `music/` | Your photos and song | Add files here |

## 1. Fill in the details

Open `js/config.js` in any text editor (Notepad, TextEdit, VS Code).

- Anything in **[square brackets]** is a placeholder. While `showPlaceholders: true`, these show on the page as dashed tags so you can see what's missing.
- Before sharing with guests, set `showPlaceholders: false`. Any placeholder you haven't filled is then hidden — an unconfirmed venue or contact is never shown.
- Reception time is set to **2:00 PM onwards** (from your invitation card). The calendar invite ends at 6:00 PM; change `calendarEnd` if needed.
- Register marriage time and venue are placeholders on purpose. Fill them in only if you want them on the site.

## 2. Add photos and music

1. Copy photos into `images/` (JPG or WebP, about 1600 px on the long side, under 400 KB each — [squoosh.app](https://squoosh.app) shrinks them for free).
2. In `config.js`, set each `src`, e.g. `bride: { src: "images/bride.jpg", alt: "Vyshnavi Byju" }`.
3. Gallery: edit the `gallery` list — add or remove rows freely. `size: "tall"` or `"wide"` makes a bigger tile.
4. Music: put your song in `music/` and set `music.src: "music/our-song.mp3"`, plus title and artist. Only use a track you have permission to use. Until then, a short original music-box melody made for this site plays. Music never plays until a guest taps.

## 3. Connect RSVPs and wishes (Google Sheets)

1. Create a Google Sheet called *Jabir Favas & Vyshnavi Byju — Guests*.
2. **Extensions → Apps Script**. Delete the sample code, paste all of `backend/Code.gs`, and save.
3. Choose the `setup` function and press **Run**. Allow access when asked. This creates the *RSVPs*, *Wishes* and *Summary* tabs.
4. **Deploy → New deployment → Web app**. Set *Execute as: Me* and *Who has access: Anyone*. Press **Deploy** and copy the URL ending in `/exec`.
5. Paste it into `backendUrl` in `config.js`.
6. Optional: set `NOTIFY_EMAIL` in Code.gs to get an email for each RSVP or wish, then **Deploy → Manage deployments → Edit → New version**.

**Wishes:** every wish where the guest chose *Everyone* appears on the website as a lantern for all guests, within about a minute (the *Show* box in the *Wishes* tab is ticked automatically). To hide a wish, untick its *Show* box. Wishes marked *Only the couple* are never sent to guests.

**Reading private wishes on the site (couple view):**
1. In Apps Script, set `COUPLE_KEY` to a secret word only the two of you know, e.g. `var COUPLE_KEY = "moonlight-2027";`, then **Deploy → Manage deployments → Edit → New version**.
2. On each of your phones, open the site once as `https://<your-site>/?couple=moonlight-2027`. The key is remembered on that phone and removed from the address bar.
3. Private wishes now glow as **gold lanterns** in the wishes sky, only on your phones. Guests never receive them, and a wrong key simply shows the normal guest view.

Never post the `?couple=` link anywhere — anyone with it can read the private wishes. To change it, set a new `COUPLE_KEY` and deploy a new version.

**Privacy:** phone numbers from RSVPs stay in your sheet and are never sent to the website. Wishes containing phone numbers, emails or links are rejected.

**Spam protection:** hidden honeypot field, minimum time on page, duplicate blocking, length limits and formula-injection protection.

**WhatsApp fallback:** if you also set `whatsappNumber` (digits with country code, e.g. `919876543210`), guests can still reply if the sheet can't be reached: their RSVP or wish opens as a ready-to-send WhatsApp message to that number.

## 4. Put it online with GitHub Pages (free)

Wishes and RSVPs go to the Google Sheet, so GitHub only needs to host the files.
1. Create a free account at github.com, then **New repository** — name it e.g. `jabir-weds-vyshnavi`, set it to **Public**.
2. **Add file → Upload files**, drag in everything *inside* the `wedding-site` folder (`index.html`, `css`, `js`, `images`, `music`, …), then **Commit changes**.
3. **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save.**
4. After a minute the site is live at `https://<your-username>.github.io/jabir-weds-vyshnavi/`.
5. To update later: upload the changed files again (same names replace the old ones).

File names on GitHub are case-sensitive: `Photo.jpg` and `photo.jpg` are different files, so keep names exactly as `config.js` uses them.

**Custom domain (optional):** buy one such as `jabirwedsvyshnavi.in` and connect it under the repository's *Settings → Pages → Custom domain*.

## 4b. WhatsApp link preview

`images/share-card.jpg` is the picture WhatsApp shows when you paste the link. After the site is online, open `index.html` and put the full address in the `og:image` and `og:url` lines, e.g. `https://your-username.github.io/jabir-weds-vyshnavi/images/share-card.jpg`, then upload `index.html` again. You can also send `share-card.jpg` itself as a photo with the link as its caption.

## 5. Before you share

- [ ] Names, dates and reception time checked
- [ ] Photos added
- [ ] Contacts filled in (numbers with +91 or other country code)
- [ ] `backendUrl` connected — send one test RSVP and one test wish, check the sheet, then delete the test rows
- [ ] Map link opens Coir Retreat (paste the venue's own Google Maps share link into `mapUrl` if you have it)
- [ ] `showPlaceholders: false`
- [ ] Open the link on a phone and test *Tap to Open*, music, RSVP and *Add to Calendar*

## Venue

Coir Retreat, Tirur, Kerala — Google plus code **VW45+W5W, Tirur, Kerala 676102**. The map and directions buttons search for this exact location.
