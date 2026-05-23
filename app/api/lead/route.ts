import { NextResponse } from 'next/server';

const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbw-5NDrPyD7MhFediGnA1Hy7JMxgq3qS67gSxYm72y_E6tauwtkNgludfiPtGmNX_kC/exec';

const WEB3FORMS_KEY = '4ee1690c-608a-47a7-9349-a602fdc867ad';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Save to Google Sheets
    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || 'Lead',
        email,
        message: message || '',
        date: new Date().toISOString(),
      }),
    });

    // Send email notification via Web3Forms
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New lead: ${email}`,
        from_name: 'MB Automate',
        email,
        message: message || 'New lead captured',
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
