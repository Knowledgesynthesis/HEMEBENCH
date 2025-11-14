import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals)
}

export function getColorForValue(value: number, normal: [number, number]): string {
  const [low, high] = normal
  if (value < low) return 'text-blue-400'
  if (value > high) return 'text-red-400'
  return 'text-green-400'
}
