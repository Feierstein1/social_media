import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongoDB";
import User from "../../lib/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "Incorrect Credentials" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Incorrect Credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const { username, email: userEmail } = existingUser;
    const token = jwt.sign(
      { userId: existingUser._id, username, email: userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create a response object
    const response = NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );

    // Set HTTP-only cookie to store JWT
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}