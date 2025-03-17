import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    // Extract the token from cookies
    const token = req.cookies.get('authToken')?.value; // Access the `value` property

    console.log('Token from cookies:', token);

    if (!token) {
      console.log('Token not found');
      return NextResponse.redirect(new URL('/unauth/login', req.url));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      username: string;
      email: string;
    };

    console.log('Decoded token:', decoded);

    const { userId, username, email } = decoded;

    // Return the user information
    return NextResponse.json({ userId, username, email });
  } catch (error) {
    console.error('Error verifying token:', error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { message: 'Token expired' },
        { status: 401 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { message: 'Error retrieving JWT information' },
      { status: 500 }
    );
  }
}