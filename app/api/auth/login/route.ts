import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "3600m" },
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "15d" },
        );

        return NextResponse.json({
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        return NextResponse.json({ message: `Server Error: ${err}` }, { status: 500 });
    }
};