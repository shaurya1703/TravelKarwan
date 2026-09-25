# Travel Karwan Website V2

This version is designed as a **full Travel Karwan brand website**, not a single-trip landing page.

## What changed
- The uploaded logo is converted into a **real PNG with transparent background** and used with `object-fit: contain`.
- The homepage is now brand-first: **Travel Karwan**, group trips, weekend escapes, corporate getaways and road journeys.
- Shimla + Jibhi is shown separately as the **current featured departure**.
- A live **news-style departure ticker** runs below the navigation.
- Upcoming trips are data-driven from `trips.js`.
- Dark / light theme remains available and the user preference is remembered.
- WhatsApp booking + enquiry flow is retained.
- Booking form supports existing trips **and future/custom trip enquiries**.
- Mobile responsive design and animation are included.

## Adding a future trip
Open `trips.js`.

Copy the sample trip object and change:
- `id`
- `title`
- `route`
- `category`
- `status`
- `price`
- `duration`
- `group`
- `image`
- `short`
- `highlights`
- `includes`
- `pickups`

The new package automatically appears:
1. In Upcoming Departures
2. In trip filters
3. In the trip modal
4. In the booking-form dropdown

No homepage redesign is needed.

## Images
Place new images inside `/assets/` and use a path like:
`assets/manali.jpg`

## Contact details currently configured
Travel Manager: Arnav Singh  
Phone / WhatsApp: +91 63884 46797  
Instagram: @travel.karwan

## Run locally
Open `index.html` in a browser.

## Deploy on Vercel
1. Upload the entire folder to GitHub.
2. Import that repository in Vercel.
3. Framework preset: **Other**
4. No build command is required.
5. Deploy.

## Important
The booking form does not collect payments or store data on a server.
It prepares a WhatsApp message containing the customer-entered details and opens WhatsApp for the customer to send it.


## Updated booking form fields
- Full Name
- Contact Number
- Email ID
- Address
- Gender
- City
- Age
- Group of People
- Travel Category: Solo / Group of Friends / Corporate Friends / Couple / Family
- Trip Selection
- Pickup Point
- Optional Additional Message

The WhatsApp enquiry now includes all of these details.
