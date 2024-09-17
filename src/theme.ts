'use client';
import { Prompt } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const prompt = Prompt({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: prompt.style.fontFamily,
  },
});

export default theme;