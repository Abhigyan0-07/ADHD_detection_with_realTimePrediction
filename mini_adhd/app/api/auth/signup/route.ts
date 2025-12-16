import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'
import { signJwt, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const { name, email, password, role } = body
    
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, role })
    
    const token = signJwt({ userId: user._id, role: user.role, name: user.name })
    setAuthCookie(token)
    
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("❌ Signup error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

