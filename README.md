# MB Automate – Social Media Content for Local Businesses

Professional social media content creation for local businesses.

## Includes

* Social media marketing landing page
* Monthly content plans
* Custom branded graphics
* Content calendars
* Facebook & Instagram post creation
* Pricing section
* FAQ section
* Consultation booking form
* Contact form with Web3Forms integration
* Mobile responsive design

## Run locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Deploy to Vercel

1. Upload this repository to GitHub.
2. Import the repository into Vercel.
3. Deploy as a Next.js project.
4. Connect your custom domain:

   * mbautomate.com
   * [www.mbautomate.com](http://www.mbautomate.com)

## Contact Form

The website uses Web3Forms for contact form submissions.

Configure your Access Key in:

```txt
app/page.tsx
```

Example:

```ts
data.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY");
```

Submitted enquiries are delivered directly to:

```txt
hello@mbautomate.com
```

## Consultation Booking

The consultation section includes:

* Business enquiry form
* Lead collection
* Calendly integration placeholder

Replace:

```ts
const calendlyUrl = "YOUR_CALENDLY_LINK";
```

with your personal Calendly booking link.

## Services

MB Automate provides:

* Social media content creation
* Graphic design for social media
* Monthly content management
* Content scheduling
* Social media strategy support
* Local business marketing

## Website

https://mbautomate.com

