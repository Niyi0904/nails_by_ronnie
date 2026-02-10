import { NextResponse } from 'next/server';

const beautyQuotes = [
  { text: "Beauty begins the moment you decide to be yourself.", author: "Coco Chanel" },
  { text: "Elegance is the only beauty that never fades.", author: "Audrey Hepburn" },
  { text: "Your nails are like jewels - don't use them like tools.", author: "Nailed by Ronnie" },
  { text: "Great nails don't happen by chance, they happen by appointment.", author: "Ronnie’s Studio" },
  { text: "Nails are the period at the end of the sentence. They complete the look.", author: "Prabal Gurung" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "The right manicure can change your whole mood.", author: "Nailed by Ronnie" },
  { text: "Life is not perfect, but your nails can be.", author: "Anonymous" }
];

export async function GET() {
  const random = beautyQuotes[Math.floor(Math.random() * beautyQuotes.length)];
  return NextResponse.json(random);
}