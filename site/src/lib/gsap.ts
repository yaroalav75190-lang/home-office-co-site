'use client'

// Single place where GSAP plugins are registered. All plugins (incl. SplitText) are free since GSAP 3.13.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
