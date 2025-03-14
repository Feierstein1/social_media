import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const response = NextResponse.json(
            { message: "User Logged out successfully" },
            { status: 200 }
        );

        response.cookies.set("authToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0, // 1 hour
            path: "/",
            sameSite: "strict",
        });

        return response
    }catch(error){
        return NextResponse.json(
            { message: "Failed to log out user" },
            { status: 500 }
        );
    }
}