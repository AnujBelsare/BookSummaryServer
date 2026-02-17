import connectDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from "@/app/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { refreshToken } = await req.json();

        if (!refreshToken) {
            return NextResponse.json(
                { message: "Refresh token required!!!" },
                { status: 400 },
            );
        }

        // verify token...

        const decode: any = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!,
        );

        const user = await User.findById(decode.userId);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        user.refreshTokens = user.refreshTokens.filter(
            (token: string) => token !== refreshToken
        );

        await user.save();

        return NextResponse.json({
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 }
        );
    }
}