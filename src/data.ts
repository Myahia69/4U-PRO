import { Product, Testimonial } from './types';

export const products: Product[] = [
  {
    id: 'comp-quantumbook',
    name: '4U PRO Quantumbook-X',
    category: 'computer',
    tagline: 'Extreme Portable Computation Lab',
    description: 'Forged from monolithic carbon-titanium with cooling vent rings that pulse silently. Features dual mechanical keysets, Liquid Retina Neon-LED 180Hz panel, and the masterfully optimized 4U Neural Rig controller.',
    price: 2499,
    originalPrice: 2890,
    image: '/src/assets/images/cyberpunk_laptop_3d_1781152107551.png',
    specs: [
      { label: 'Processor', value: '4U Deca-Core Terabeat CPU' },
      { label: 'Memory', value: '128GB LPDDR6 Dual-Channel' },
      { label: 'Graphics', value: 'Quantum Liquid-Cooled GPU' },
      { label: 'Storage', value: '4TB PCI-e Gen9 Hyper-Drive' },
      { label: 'Screen', value: '16.2" 180Hz Neon-LED display' }
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0B0C10', previewColor: 'bg-neutral-900 border-neutral-700' },
      { name: 'Laser Purple', hex: '#BD00FF', previewColor: 'bg-purple-600 border-purple-400' },
      { name: 'Electric Cyan', hex: '#00F0FF', previewColor: 'bg-cyan-400 border-cyan-300' }
    ],
    rating: 5.0,
    reviewsCount: 342,
    features: [
      'Dual-phase vapor chamber thermal control',
      'Programmable macro-matrix control dial',
      'Encrypted neural terminal BIOS signature',
      'Advanced multi-device mesh link'
    ]
  },
  {
    id: 'comp-deskomega',
    name: '4U PRO Desk Server-Omega',
    category: 'computer',
    tagline: 'The Ultimate Sub-Space Computation Tower',
    description: 'A structural masterpiece designed for compiled computation, hyper-detailed rendering, and extreme multi-network management. Built with isolated heat zones and customizable front illumination vents.',
    price: 3899,
    originalPrice: 4200,
    image: '/src/assets/images/cyberpunk_desktop_3d_1781152123243.png',
    specs: [
      { label: 'Processor', value: '64-Core Sub-Acoustic Processor' },
      { label: 'Memory', value: '256GB Liquid-Mesh System RAM' },
      { label: 'Graphics', value: 'Dual 4U Hyperion-X 48GB GPU' },
      { label: 'Thermals', value: 'Active Liquid Nitrogen Loops' },
      { label: 'Power', value: '1600W Quantum Solid-State PSU' }
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0B0C10', previewColor: 'bg-neutral-900 border-neutral-700' },
      { name: 'Laser Purple', hex: '#BD00FF', previewColor: 'bg-purple-600 border-purple-400' }
    ],
    rating: 4.9,
    reviewsCount: 187,
    features: [
      'Isolated high-conduction chamber panels',
      'Advanced biometric secure cold startup',
      'Integrated structural multi-rig handles',
      'Pre-installed 4U-OS Enterprise v10'
    ]
  },
  {
    id: 'phone-enigma',
    name: '4U PRO X-Enigma',
    category: 'phone',
    tagline: 'The Quantum Leap in Handheld Telemetry',
    description: 'Engineered with a liquid-graphene chassis, a holographic crystal display, and powered by our proprietary 4nm Nanotech AI Processor. Redefines extreme performance with silent cooling loops and lightwave sensors.',
    price: 1399,
    originalPrice: 1599,
    image: '/src/assets/images/cyberpunk_phone_3d_1781150520556.png',
    specs: [
      { label: 'Processor', value: '4U Quantum AI Neural Engine' },
      { label: 'Display', value: '6.8" 165Hz Holographic OLED' },
      { label: 'Camera', value: '180MP Vector & Lightwave Lenses' },
      { label: 'Battery', value: '6000mAh Carbon-Silicon' },
      { label: 'Ecosystem', value: 'Integrated Quantum-Net Shield' }
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0B0C10', previewColor: 'bg-neutral-900 border-neutral-700' },
      { name: 'Laser Purple', hex: '#BD00FF', previewColor: 'bg-purple-600 border-purple-400Shadow' },
      { name: 'Electric Cyan', hex: '#00F0FF', previewColor: 'bg-cyan-400 border-cyan-300' }
    ],
    rating: 4.9,
    reviewsCount: 1240,
    features: [
      'Quantum-encrypted communication protocols',
      'Under-display holographic projector lens',
      'Nano-alloy frame with self-healing anti-scratch layer',
      '0 to 100% charger capacity in 8.5 minutes dry loop'
    ]
  },
  {
    id: 'phone-titan',
    name: '4U PRO Titan-V',
    category: 'phone',
    tagline: 'Titanium-Fused Tactical Mobile Block',
    description: 'Designed for extreme tech-enthusiasts, with deep carbon armor, a secure biometric neural core, and dual optical laser focus lenses. Capable of harsh-environment operation while retaining supreme minimalist aesthetic.',
    price: 1199,
    originalPrice: 1299,
    image: '/src/assets/images/cyberpunk_phone_3d_1781150520556.png', // Fallback to same premium smartphone graphic or add styling
    specs: [
      { label: 'Processor', value: 'Titan Core Hybrid v9' },
      { label: 'Display', value: '6.7" Liquid Crystal Micro-LED' },
      { label: 'Armor', value: 'MIL-SPEC Carbon Titanium Alloy' },
      { label: 'Storage', value: '1TB Super-Conductive SSD' },
      { label: 'Signal', value: 'Sub-space Ultra-band Antennas' }
    ],
    colors: [
      { name: 'Titan Grey', hex: '#374151', previewColor: 'bg-gray-600 border-gray-400' },
      { name: 'Laser Purple', hex: '#BD00FF', previewColor: 'bg-purple-600 border-purple-400' },
      { name: 'Stealth Matte', hex: '#111827', previewColor: 'bg-black border-neutral-800' }
    ],
    rating: 4.8,
    reviewsCount: 894,
    features: [
      'Sub-space array signal booster',
      'Carbon-fiber composite armor frame',
      'Thermal vapor cooling chamber v3',
      'Offline telemetry storage mode'
    ]
  },
  {
    id: 'acc-headphone',
    name: 'AeroPulse Buds Max',
    category: 'accessory',
    tagline: 'Pure Sound-Field Isolation & Cyber Resonance',
    description: 'Hear sounds from the tomorrow. Incorporating physical sound-field isolation, adaptive digital audio shaping, and stunning neon pulse visual feedback grids integrated directly on the earcups.',
    price: 349,
    originalPrice: 399,
    image: '/src/assets/images/cyberpunk_headphones_3d_1781150538611.png',
    specs: [
      { label: 'Frequency', value: '4Hz - 48,000Hz Ultra Range' },
      { label: 'Isolation', value: '45dB Smart Neural Active Isolation' },
      { label: 'Battery', value: '55 Hours Cyber-Mesh Power' },
      { label: 'Illumination', value: 'Chroma-Sync Sound Reactive Grid' }
    ],
    colors: [
      { name: 'Laser Purple', hex: '#BD00FF', previewColor: 'bg-purple-600 border-purple-400' },
      { name: 'Electric Cyan', hex: '#00F0FF', previewColor: 'bg-cyan-400 border-cyan-300' },
      { name: 'Minimalist Black', hex: '#0B0C10', previewColor: 'bg-neutral-900 border-neutral-700' }
    ],
    rating: 4.9,
    reviewsCount: 612,
    features: [
      'Dual multi-node hybrid active cancel technology',
      'AeroSync lightning latency transmission (1.2ms)',
      'Subtle breathing neon accent rings',
      'Tactile knurled aluminum physical volume interface'
    ]
  },
  {
    id: 'acc-watch',
    name: 'Chronos-7 Smartwatch',
    category: 'accessory',
    tagline: 'Biological Analytics & Holographic Feedback',
    description: 'Active biological telemetry right on your wrist. Track your neural waves, custom blood oxygen metrics, and interact with widgets using a projecting holo-dial hovering just above the screen.',
    price: 279,
    originalPrice: 299,
    image: '/src/assets/images/cyberpunk_watch_3d_1781150555203.png',
    specs: [
      { label: 'Sensor', value: 'Holo-Pulse Optical Bio-Telemetry' },
      { label: 'Projector', value: '0.9" Micro-Holo Jet Lens' },
      { label: 'Battery', value: '14 Days Eco-Link Capacity' },
      { label: 'Water', value: '50m Tactical Depth Rated' }
    ],
    colors: [
      { name: 'Neon Blue', hex: '#00F0FF', previewColor: 'bg-cyan-500 border-cyan-300' },
      { name: 'Laser Violet', hex: '#BD00FF', previewColor: 'bg-purple-600 border-purple-400' },
      { name: 'Synthetic Silver', hex: '#E5E7EB', previewColor: 'bg-slate-200 border-slate-400' }
    ],
    rating: 4.7,
    reviewsCount: 421,
    features: [
      'True holo-dial system widget projection',
      'Real-time physical heart rate & biosensor matrix',
      'Syncs seamlessly with X-Enigma ultra phone',
      'Custom liquid silicone micro-vented bands'
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Evelyn Carter',
    role: 'Cybernetic System Architect',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    comment: 'The X-Enigma phone feels like it was engineered in the 22nd century. The haptic responses and structural design are incredibly satisfying, and the ecosystem accessories pair with zero latency.',
    rating: 5,
    platform: 'X / Twitter'
  },
  {
    id: 'test-2',
    name: 'Zenith Labs',
    role: 'Hardware Review Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    comment: 'AeroPulse Buds Max delivers unmatched separation depth. The light reactions and raw materials of 4U PRO items are premium-tier. Truly standard-setting for cyber-tech styling.',
    rating: 5,
    platform: 'TechRadar Premium'
  },
  {
    id: 'test-3',
    name: 'Marcus Vance',
    role: 'Crypto-Trader & Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    comment: 'Chronos-7 Watch projecting clock widgets sounds like sci-fi, but it is real and completely functional. Customer support was instant—unparalleled after-purchase support.',
    rating: 5,
    platform: 'Digital Nomad Digest'
  }
];
