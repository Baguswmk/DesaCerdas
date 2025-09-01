import prisma from '../../config/database.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email sudah terdaftar, gunakan email lain' 
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        password: hashedPassword,
      },
    });

    console.log('✅ User baru terdaftar:', user.email);

    res.status(201).json({ 
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Register Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mendaftar, coba lagi nanti' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Email tidak ditemukan' 
      });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Password salah' 
      });
    }

    
    const token = jwt.sign(
      { 
        id: user.id, 
        name: user.name,
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } 
    );

    
    res
      .cookie('token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', 
        maxAge: 24 * 60 * 60 * 1000, 
      })
      .json({ 
        success: true,
        message: 'Login berhasil!', 
        data: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          role: user.role 
        } 
      });

    console.log('✅ User login:', user.email);
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal login, coba lagi nanti' 
    });
  }
};

export const logout = (req, res) => {
  try {
    res
      .clearCookie('token')
      .json({ 
        success: true,
        message: 'Logout berhasil' 
      });
    
    console.log('✅ User logout:', req.user?.email);
  } catch (error) {
    console.error('❌ Logout Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal logout' 
    });
  }
};

export const getMe = (req, res) => {
  try {
    const { id, email, role, name } = req.user;
    res.json({ 
      success: true,
      data: { id, email, role, name } 
    });
  } catch (error) {
    console.error('❌ GetMe Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengambil data user' 
    });
  }
};