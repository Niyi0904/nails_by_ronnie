import { NextResponse } from 'next/server';
import db from '../../../../models/index'

const beautyQuotes = [
  {
    text: "Beauty begins the moment you decide to be yourself.",
    author: "Coco Chanel",
  },
  {
    text: "Elegance is when the inside is as beautiful as the outside.",
    author: "Nailed by Ronnie",
  },
  {
    text: "Invest in your nails. It’s the only time you can be a little selfish and a lot glamorous.",
    author: "Ronnie’s Studio",
  },
  {
    text: "Nails speak louder than words.",
    author: "Anonymous",
  },
  {
    text: "Your nails are a reflection of your style and self-care.",
    author: "Nailed by Ronnie",
  }
];

export async function GET() {
  const random = beautyQuotes[Math.floor(Math.random() * beautyQuotes.length)];
  return NextResponse.json(random);
}
