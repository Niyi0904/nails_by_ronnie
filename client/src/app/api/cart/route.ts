import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    console.log(body);

    try {
        const response = await fetch('http://localhost:3030/api/cart/addItemToCart', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), 
        });


        if (!response.ok) {
            return NextResponse.json({message: 'unable to add item to cart', staus: response.statusText}, {status: response.status})
        }

        const data = await response.json();
        return NextResponse.json({message: 'item successfully added to cart', data}, {status: response.status})
    } catch (error) {
        console.log('Cart creation error: ', error);
        return NextResponse.json({message: 'internal server error'}, {status: 500})
    }
    
}