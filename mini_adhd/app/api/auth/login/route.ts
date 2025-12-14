import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'
import { signJwt, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }
  const user = await User.findOne({ email })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const token = signJwt({ userId: user._id, role: user.role, name: user.name })
  setAuthCookie(token)
  return NextResponse.json({ ok: true })
}

