import clsx from 'clsx';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
import SectionTitle from '@/components/sections/SectionTitle';
import AppWindow from '@/components/wireframes/AppWindow';

// Định nghĩa kiểu dự án (mở rộng)
type ProjectType =
  | 'wmember'
  | 'gstore'
  | 'wstore'
  | 'wmember-admin'
  | 'gstore-admin'
  | 'wstore-seller'
  | 'wstore-admin'
  | 'ecmp';

function getColorClasses(color: string) {
  const colorMap = {
    purple: {
      border: 'border-purple-200 dark:border-purple-800/40',
      bg: 'bg-white dark:bg-gray-800',
      text: 'text-purple-700 dark:text-purple-300',
      hover: 'hover:border-purple-300',
      gradient:
        'from-purple-400 to-violet-600 dark:from-purple-500 dark:to-violet-700',
      shadow: 'shadow-purple-500/20 dark:shadow-purple-800/30',
      button: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500/50',
      techTag:
        'border-purple-200 bg-white text-purple-700 hover:border-purple-300 dark:border-purple-800/40 dark:bg-gray-800 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-900/50',
      sectionBorder: 'border-purple-100 dark:border-purple-900/50',
      sectionBg: 'bg-purple-50/50 dark:bg-purple-950/20',
      cardBorder: 'border-purple-200/60 dark:border-purple-800/30',
      cardBg: 'bg-purple-50/30 dark:bg-purple-950/10',
      iconGradient:
        'from-purple-400 to-violet-600 dark:from-purple-500 dark:to-violet-700',
      iconShadow: 'shadow-purple-500/20 dark:shadow-purple-800/30',
      visitButton:
        'from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-purple-900/20',
      bgGradient:
        'from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20',
      bgDecor1: 'bg-purple-100 dark:bg-purple-700',
      bgDecor2: 'bg-violet-100 dark:bg-violet-700',
      bgDecor3: 'bg-indigo-100 dark:bg-indigo-700',
      headerGradient:
        'from-purple-500 to-violet-600 shadow-purple-500/20 dark:shadow-purple-800/30',
    },
    slate: {
      border: 'border-slate-200 dark:border-slate-800/40',
      bg: 'bg-white dark:bg-gray-800',
      text: 'text-slate-700 dark:text-slate-300',
      hover: 'hover:border-slate-300',
      gradient:
        'from-slate-400 to-blue-600 dark:from-slate-500 dark:to-blue-700',
      shadow: 'shadow-slate-500/20 dark:shadow-slate-800/30',
      button: 'bg-slate-500 hover:bg-slate-600 focus:ring-slate-500/50',
      techTag:
        'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800/40 dark:bg-gray-800 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/50',
      sectionBorder: 'border-slate-100 dark:border-slate-900/50',
      sectionBg: 'bg-slate-50/50 dark:bg-slate-950/20',
      cardBorder: 'border-slate-200/60 dark:border-slate-800/30',
      cardBg: 'bg-slate-50/30 dark:bg-slate-950/10',
      iconGradient:
        'from-slate-400 to-blue-600 dark:from-slate-500 dark:to-blue-700',
      iconShadow: 'shadow-slate-500/20 dark:shadow-slate-800/30',
      visitButton:
        'from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 shadow-slate-900/20',
      bgGradient:
        'from-white to-slate-50 dark:from-gray-800 dark:to-slate-900/20',
      bgDecor1: 'bg-slate-100 dark:bg-slate-700',
      bgDecor2: 'bg-blue-100 dark:bg-blue-700',
      bgDecor3: 'bg-indigo-100 dark:bg-indigo-700',
      headerGradient:
        'from-slate-500 to-blue-600 shadow-slate-500/20 dark:shadow-slate-800/30',
    },
    blue: {
      border: 'border-blue-200 dark:border-blue-800/40',
      bg: 'bg-white dark:bg-gray-800',
      text: 'text-blue-700 dark:text-blue-300',
      hover: 'hover:border-blue-300',
      gradient: 'from-blue-400 to-sky-600 dark:from-blue-500 dark:to-sky-700',
      shadow: 'shadow-blue-500/20 dark:shadow-blue-800/30',
      button: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500/50',
      techTag:
        'border-blue-200 bg-white text-blue-700 hover:border-blue-300 dark:border-blue-800/40 dark:bg-gray-800 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/50',
      sectionBorder: 'border-blue-100 dark:border-blue-900/50',
      sectionBg: 'bg-blue-50/50 dark:bg-blue-950/20',
      cardBorder: 'border-blue-200/60 dark:border-blue-800/30',
      cardBg: 'bg-blue-50/30 dark:bg-blue-950/10',
      iconGradient:
        'from-blue-400 to-sky-600 dark:from-blue-500 dark:to-sky-700',
      iconShadow: 'shadow-blue-500/20 dark:shadow-blue-800/30',
      visitButton:
        'from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-blue-900/20',
      bgGradient:
        'from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20',
      bgDecor1: 'bg-blue-100 dark:bg-blue-700',
      bgDecor2: 'bg-sky-100 dark:bg-sky-700',
      bgDecor3: 'bg-cyan-100 dark:bg-cyan-700',
      headerGradient:
        'from-blue-500 to-sky-600 shadow-blue-500/20 dark:shadow-blue-800/30',
    },
    indigo: {
      border: 'border-indigo-200 dark:border-indigo-800/40',
      bg: 'bg-white dark:bg-gray-800',
      text: 'text-indigo-700 dark:text-indigo-300',
      hover: 'hover:border-indigo-300',
      gradient:
        'from-indigo-400 to-blue-600 dark:from-indigo-500 dark:to-blue-700',
      shadow: 'shadow-indigo-500/20 dark:shadow-indigo-800/30',
      button: 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500/50',
      techTag:
        'border-indigo-200 bg-white text-indigo-700 hover:border-indigo-300 dark:border-indigo-800/40 dark:bg-gray-800 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/50',
      sectionBorder: 'border-indigo-100 dark:border-indigo-900/50',
      sectionBg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      cardBorder: 'border-indigo-200/60 dark:border-indigo-800/30',
      cardBg: 'bg-indigo-50/30 dark:bg-indigo-950/10',
      iconGradient:
        'from-indigo-400 to-blue-600 dark:from-indigo-500 dark:to-blue-700',
      iconShadow: 'shadow-indigo-500/20 dark:shadow-indigo-800/30',
      visitButton:
        'from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-900/20',
      bgGradient:
        'from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20',
      bgDecor1: 'bg-indigo-100 dark:bg-indigo-700',
      bgDecor2: 'bg-blue-100 dark:bg-blue-700',
      bgDecor3: 'bg-slate-100 dark:bg-slate-700',
      headerGradient:
        'from-indigo-500 to-blue-600 shadow-indigo-500/20 dark:shadow-indigo-800/30',
    },
  };

  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
}

const projectData = {
  ecmp: {
    title: 'Enterprise Cloud Management Platform (ECMP)',
    fullTitle: 'Enterprise Cloud Management Platform',
    description:
      'A sophisticated cloud management platform for enterprise-level control over cloud infrastructure.',
    subtitle: 'Cloud Management Platform',
    period: '2025',
    role: 'Frontend Developer',
    color: 'indigo',
    secondColor: 'blue',
    accentColor: 'slate',
    logo: '/assets/images/skylab-logo.webp',
    iconImage: '/assets/images/projects/xr-cloud.webp',
    iconBg: '#131558',
    summary: [
      '<span class="font-semibold">Built</span> a comprehensive cloud management platform enabling efficient control over distributed cloud resources.',
      '<span class="font-semibold">Developed</span> robust interfaces for multi-cloud resource management while <span class="font-semibold">implementing</span> secure role-based access control systems.',
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Ant Design',
      'WebSocket',
      'Zustand',
      'React Query',
      'i18next',
    ],
    features: [
      'Role-based access control with multi-tenancy',
      'Multi-cloud provider integration (AWS, Azure, GCP)',
      'Real-time resource monitoring and alerts',
      'Storage and network management interface',
      'Cluster management and orchestration',
    ],
    contributions: [
      'Implemented comprehensive role-based access control',
      'Built interfaces for cloud zones and regions management',
      'Developed multi-cloud resource management system',
      'Created storage and network management features',
      'Implemented cluster management capabilities',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Main cloud */}
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        {/* Multi-cloud elements */}
        <path d="M9 16a3 3 0 1 0 6 0" />
        <path d="M15 16a3 3 0 1 0 6 0" />
        {/* Connection/Network lines */}
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  wmember: {
    title: 'WMember.io',
    fullTitle: 'WMember.io - Community Platform',
    description:
      'Community development platform with membership management and engagement tools.',
    subtitle: 'Community Platform',
    period: '2023 - 2025',
    role: 'Frontend Developer',
    url: 'https://wmember.io',
    color: 'purple',
    secondColor: 'violet',
    accentColor: 'indigo',
    logo: '/assets/images/wowi-logo.webp',
    iconImage: '/assets/images/projects/wol-tech-logo.webp',
    iconBg: '#17092f',
    summary: [
      '<span class="font-semibold">Led</span> development of a comprehensive platform for community development and membership management with modern UX.',
      '<span class="font-semibold">Architected</span> the front-end infrastructure with focus on performance and scalability while <span class="font-semibold">implementing</span> real-time WebSocket capabilities for interactive user experiences.',
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Framer Motion',
      'Shadcn UI',
      'React Query',
      'Zustand',
      'Socket.io',
    ],
    features: [
      'Community engagement tools with real-time notifications',
      'Advanced member management system',
      'Content sharing platform with rich-media support',
      'Real-time WebSocket chat system',
      'Analytics dashboard for community leaders',
    ],
    contributions: [
      'Designed and built the WebSocket-based chat system',
      'Optimized SEO using Next.js SSR/SSG strategies',
      'Implemented code splitting and lazy loading for faster page loads',
      'Created custom hooks for shared business logic',
      'Developed automated testing suite with Jest and Cypress',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  'wmember-admin': {
    title: 'WMember Admin',
    fullTitle: 'WMember Admin - Dashboard',
    description:
      'Administrator control panel for the WMember community platform with advanced management capabilities.',
    subtitle: 'Admin Dashboard',
    period: '2023 - 2025',
    role: 'Frontend Developer',
    color: 'purple', // Different color from main product
    secondColor: 'violet',
    accentColor: 'indigo',
    logo: '/assets/images/wowi-logo.webp',
    iconImage: '/assets/images/projects/wol-tech-logo.webp',
    iconBg: '#17092f',
    summary: [
      '<span class="font-semibold">Developed</span> a powerful admin dashboard for comprehensive control over the WMember community platform.',
      '<span class="font-semibold">Designed</span> intuitive interfaces for complex data management while <span class="font-semibold">implementing</span> real-time monitoring and analytics for platform health.',
    ],
    techStack: [
      'Vite',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Tanstack Table',
      'Recharts',
      'React Hook Form',
      'Zod',
      'React Query',
    ],
    features: [
      'Comprehensive user management and moderation',
      'Real-time analytics dashboard with filters',
      'Content moderation tools with approval workflows',
      'Subscription and billing management',
      'Admin permission controls with audit logging',
    ],
    contributions: [
      'Built role-based access control system',
      'Implemented real-time admin notifications',
      'Created user management interfaces with bulk actions',
      'Developed analytics dashboard with customizable reports',
      'Integrated with payment providers for subscription management',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  gstore: {
    title: 'G-Store.ai',
    fullTitle: 'G-Store.ai - Tech Solutions',
    description:
      'Technology solutions and financial management platform with smart analytics.',
    subtitle: 'Tech Solutions',
    period: '2022 - 2024',
    role: 'Frontend Developer',
    url: 'https://g-store.ai',
    color: 'slate',
    secondColor: 'blue',
    accentColor: 'indigo',
    logo: '/assets/images/wowi-logo.webp',
    iconImage: '/assets/images/projects/g-store-logo.webp',
    iconBg: '#001e51',
    summary: [
      '<span class="font-semibold">Developed</span> a technology solutions and financial management platform with intelligent analytics and modern UI.',
      '<span class="font-semibold">Designed</span> the front-end architecture with real-time data visualization while <span class="font-semibold">optimizing</span> performance for complex financial calculations and reports.',
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Material UI',
      'Redux',
      'React Query',
      'D3.js',
      'Socket.io',
    ],
    features: [
      'Financial management with real-time currency conversion',
      'Interactive data visualization dashboard',
      'WebSocket-powered real-time analytics',
      'Business intelligence reporting system',
      'Customizable workflow automation tools',
    ],
    contributions: [
      'Created responsive data visualization components',
      'Improved application performance with SSR/SSG',
      'Implemented WebSocket integration for real-time updates',
      'Optimized image loading and processing for reports',
      'Built drag-and-drop workflow automation interface',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
  'gstore-admin': {
    title: 'G-Store Admin',
    fullTitle: 'G-Store Admin - Management Console',
    description:
      'Powerful management console for G-Store.ai with comprehensive control over financial data and analytics.',
    subtitle: 'Management Console',
    period: '2022 - 2024',
    role: 'Frontend Developer',
    color: 'slate', // Different color from main product
    secondColor: 'blue',
    accentColor: 'indigo',
    logo: '/assets/images/wowi-logo.webp', // Will use fallback icon
    iconImage: '/assets/images/projects/g-store-logo.webp',
    iconBg: '#001e51',
    summary: [
      '<span class="font-semibold">Built</span> an advanced management console for G-Store.ai with comprehensive financial controls and analytics.',
      '<span class="font-semibold">Engineered</span> robust data visualization components while <span class="font-semibold">integrating</span> complex filtering and reporting capabilities.',
    ],
    techStack: [
      'Vite',
      'React',
      'TypeScript',
      'Material UI',
      'Redux Toolkit',
      'D3.js',
      'React Query',
      'React Hook Form',
      'Vitest',
    ],
    features: [
      'Financial reporting dashboard with export functionality',
      'User access management with role-based permissions',
      'Advanced business analytics tools with drill-down capabilities',
      'Workflow configuration and automation tools',
      'System health monitoring and alerts',
    ],
    contributions: [
      'Developed advanced data visualization components',
      'Created Excel/PDF export functionality for reports',
      'Implemented role-based access control system',
      'Built workflow automation designer interface',
      'Optimized performance for large datasets',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  wstore: {
    title: 'WStore.vn',
    fullTitle: 'WStore.vn - E-commerce Platform',
    description:
      'Vietnamese e-commerce marketplace with modern shopping experience and multi-vendor capabilities.',
    subtitle: 'E-commerce Platform',
    period: '2021 - 2024',
    role: 'Frontend Developer',
    url: 'https://wstore.vn',
    color: 'blue',
    secondColor: 'sky',
    accentColor: 'cyan',
    logo: '/assets/images/wowi-logo.webp', // Will use fallback icon
    iconImage: '/assets/images/projects/wstore-logo.webp',
    iconBg: '#0666fe',
    summary: [
      '<span class="font-semibold">Built</span> a modern Vietnamese e-commerce marketplace with smooth UX and comprehensive vendor management features.',
      '<span class="font-semibold">Collaborated</span> with backend developers to integrate payment systems while <span class="font-semibold">enhancing</span> the search system with advanced filtering and product recommendation algorithms.',
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Bootstrap',
      'Framer Motion',
      'React Query',
      'Zustand',
      'WebP/AVIF',
    ],
    features: [
      'Multi-vendor marketplace with seller dashboards',
      'Vietnamese payment gateway integrations',
      'Responsive product showcase with image galleries',
      'Advanced search with faceted navigation',
      'Real-time inventory management system',
    ],
    contributions: [
      'Architected product catalog system with filterable attributes',
      'Implemented WebSocket for real-time inventory updates',
      'Optimized image loading with Next.js Image component',
      'Designed responsive UI for all device types',
      'Built advanced SEO system with SSR/SSG capabilities',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  'wstore-seller': {
    title: 'WStore Seller',
    fullTitle: 'WStore Seller - Vendor Portal',
    description:
      'Vendor portal for WStore.vn allowing sellers to manage products, orders, and sales analytics.',
    subtitle: 'Seller Portal',
    period: '2021 - 2024',
    role: 'Frontend Developer',
    color: 'blue', // Different color from main product
    secondColor: 'sky',
    accentColor: 'cyan',
    logo: '/assets/images/wowi-logo.webp', // Will use fallback icon
    iconImage: '/assets/images/projects/wstore-logo.webp',
    iconBg: '#0666fe',
    summary: [
      '<span class="font-semibold">Built</span> an intuitive seller portal for WStore.vn vendors to manage their store operations efficiently.',
      '<span class="font-semibold">Designed</span> dashboards for tracking sales performance while <span class="font-semibold">creating</span> streamlined interfaces for product and order management.',
    ],
    techStack: [
      'Vite',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Chart.js',
      'React Hook Form',
      'React Query',
      'Zustand',
      'React Dropzone',
    ],
    features: [
      'Product management with batch operations',
      'Order fulfillment and status tracking',
      'Sales analytics with performance insights',
      'Inventory management with stock alerts',
      'Marketing campaign tools with performance tracking',
    ],
    contributions: [
      'Developed product management interface with image uploading',
      'Created sales analytics dashboard with filters',
      'Built inventory management system with alerts',
      'Implemented order fulfillment workflow',
      'Designed promotional tools for sellers',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M12 2a2 2 0 0 0-2 2v8l-4 4" />
        <path d="M19 10a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-10Z" />
      </svg>
    ),
  },
  'wstore-admin': {
    title: 'WStore Admin',
    fullTitle: 'WStore Admin - Control Panel',
    description:
      'Administrative control panel for WStore.vn e-commerce platform with comprehensive management tools.',
    subtitle: 'Admin Panel',
    period: '2021 - 2024',
    role: 'Frontend Developer',
    color: 'blue', // Different color from main product
    secondColor: 'sky',
    accentColor: 'cyan',
    logo: '/assets/images/wowi-logo.webp', // Will use fallback icon
    iconImage: '/assets/images/projects/wstore-logo.webp',
    iconBg: '#0666fe',
    summary: [
      '<span class="font-semibold">Developed</span> a comprehensive control panel for the WStore.vn e-commerce platform with robust management tools.',
      '<span class="font-semibold">Implemented</span> order processing workflows and <span class="font-semibold">created</span> interfaces for managing products, vendors, and promotions.',
    ],
    techStack: [
      'Vite',
      'React',
      'TypeScript',
      'Ant Design',
      'Zustand',
      'React Query',
      'Apex Charts',
      'React Hook Form',
      'Testing Library',
    ],
    features: [
      'Product catalog management with bulk operations',
      'Order processing system with status tracking',
      'Vendor approval and management workflow',
      'Comprehensive report generation',
      'Promotion and discount management',
    ],
    contributions: [
      'Built product management interfaces with bulk editing',
      'Developed order processing pipeline and tracking',
      'Created vendor approval workflow and verification',
      'Implemented promotion rule engine',
      'Designed dashboard with key performance indicators',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v14" />
      </svg>
    ),
  },
};

// Advanced Techniques Card Component
type AdvancedTechniquesCardProps = {
  color?: string;
  isAdmin?: boolean;
};

function AdvancedTechniquesCard({
  color = 'purple',
  isAdmin = false,
}: AdvancedTechniquesCardProps) {
  const colors = getColorClasses(color);

  const techniques = isAdmin ? (
    <>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <span className="font-medium">Optimized</span> application performance
        with code splitting, lazy loading, and component virtualization.
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <span className="font-medium">Implemented</span> efficient state
        management with global stores and context-based caching solutions.
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <span className="font-medium">Developed</span> responsive designs with
        advanced CSS techniques and optimized rendering strategies.
      </p>
    </>
  ) : (
    // Main app techniques content
    <>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <span className="font-medium">Implemented</span> performance
        optimizations including SSR/SSG rendering strategies for optimal SEO and
        faster page loads.
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <span className="font-medium">Optimized</span> core web vitals through
        code splitting, lazy loading, and advanced caching techniques.
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <span className="font-medium">Developed</span> responsive images with
        automatic optimization and WebP format conversion.
      </p>
    </>
  );

  // Danh sách các tag kỹ thuật dựa vào loại ứng dụng
  const techTags = isAdmin
    ? [
        'Code Splitting',
        'Lazy Loading',
        'Virtualization',
        'State Management',
        'Bundle Optimization',
      ]
    : [
        'SSR/SSG',
        'Code Splitting',
        'Lazy Loading',
        'Image Optimization',
        'Caching',
      ];

  return (
    <div
      className={`mb-6 rounded-lg bg-gradient-to-r p-5 shadow-sm backdrop-blur-sm ${colors.cardBorder} ${colors.cardBg}`}
    >
      <h3 className={`mb-3 flex items-center font-semibold ${colors.text}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        Advanced Techniques
      </h3>

      <div className="space-y-3">{techniques}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {techTags.map((tech) => (
          <span
            key={tech}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.techTag}`}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

type VisitSiteButtonProps = {
  url?: string;
  color?: string;
};

// Visit Site Button Component
function VisitSiteButton({ url = '', color = 'purple' }: VisitSiteButtonProps) {
  if (!url) return null;

  const colors = getColorClasses(color);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`dark:shadow-opacity-20 inline-flex items-center rounded-lg bg-gradient-to-r px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colors.visitButton}`}
    >
      <span>Visit Site</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

type ProjectSectionProps = {
  title: string;
  items?: string[];
  color: string;
  icon: React.ReactNode;
};

// Section for tech stack, features, and contributions
function ProjectSection({
  title,
  items = [],
  color,
  icon,
}: ProjectSectionProps) {
  const colors = getColorClasses(color);

  return (
    <div
      className={`rounded-lg border p-5 shadow-sm transition-all duration-300 hover:shadow-md ${colors.cardBorder} ${colors.cardBg}`}
    >
      <h3 className="mb-3 flex items-center font-semibold text-gray-800 dark:text-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`mr-2 h-5 w-5 ${colors.text}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
        {title}
      </h3>

      {Array.isArray(items) && (
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          {items.map((item) => (
            <li key={item} className="flex items-start">
              <span
                className={`mr-2 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full p-[3px] text-xs ${colors.text}`}
              >
                <ArrowRight size={12} />
              </span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Project Detail Component
type ProjectDetailProps = {
  project: {
    color: string;
    secondColor: string;
    accentColor: string;
    title: string;
    subtitle: string;
    period: string;
    summary: string[];
    techStack: string[];
    features: string[];
    contributions: string[];
    role: string;
    url?: string;
    iconImage?: string;
    iconBg?: string;
  };
};

function ProjectDetail({ project }: ProjectDetailProps) {
  const {
    color,
    secondColor,
    accentColor,
    title,
    subtitle,
    period,
    summary,
    techStack,
    features,
    contributions,
    role,
    url,
    iconImage,
    iconBg,
  } = project;

  const colors = getColorClasses(color);

  return (
    <div
      className={`relative overflow-hidden rounded-lg rounded-tl-none rounded-tr-none p-6 ${colors.bgGradient}`}
    >
      {/* Background decorative elements */}
      <div
        className={`absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full opacity-50 blur-3xl dark:opacity-10 ${colors.bgDecor1}`}
      />
      <div
        className={`absolute bottom-0 left-0 -mb-12 -ml-12 h-40 w-40 rounded-full opacity-50 blur-3xl dark:opacity-10 ${colors.bgDecor2}`}
      />
      <div
        className={`absolute left-1/3 top-1/2 -ml-12 -mt-12 h-24 w-24 rounded-full opacity-30 blur-2xl dark:opacity-10 ${colors.bgDecor3}`}
      />

      {/* Header */}
      <div className="relative mb-6 flex items-center">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {title}
          </h2>
          <p className={`text-sm font-medium ${colors.text}`}>{subtitle}</p>
        </div>
        <div className="ml-auto">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${colors.text}`}
          >
            {period}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div
        className={`mb-6 rounded-lg p-5 text-base leading-relaxed text-gray-700 backdrop-blur-sm dark:text-gray-300 ${colors.cardBorder} ${colors.cardBg}`}
      >
        {summary.map((paragraph, idx) => (
          <p
            key={paragraph}
            className={idx !== summary.length - 1 ? 'mb-3' : ''}
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center font-semibold text-gray-800 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`mr-2 h-5 w-5 ${colors.text}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech: any) => (
            <span
              key={tech}
              className={`rounded-full px-3 py-1.5 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md ${colors.techTag}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Features and Contributions */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <ProjectSection
          title="Key Features"
          items={features}
          color={color}
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          }
        />

        <ProjectSection
          title="My Contributions"
          items={contributions}
          color={color}
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          }
        />
      </div>

      {/* Advanced Techniques */}
      <AdvancedTechniquesCard
        color={color}
        isAdmin={
          project.title.includes('Admin') || project.title.includes('Seller')
        }
      />

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">Role:</span> {role}
        </div>
        <VisitSiteButton url={url} color={color} />
      </div>
    </div>
  );
}

// Main component - đảm bảo hiển thị đúng các tab
function ProjectsContents() {
  const [currentState, setCurrentState] = useState<ProjectType>('ecmp');
  const currentProject = projectData[currentState];

  // Nhóm các dự án theo công ty/logo để hiển thị trong sidebar
  const projectGroups = {
    skylab: ['ecmp'], // Projects using skylab-logo.webp
    wowi: [
      'wmember',
      'wmember-admin',
      'gstore',
      'gstore-admin',
      'wstore',
      'wstore-seller',
      'wstore-admin',
    ], // Projects using wowi-logo.webp
  };

  return (
    <>
      <SectionTitle
        title="Enterprise Web Applications"
        caption="Professional Projects"
        description="Developed modern, high-performance web platforms that solve real business challenges using cutting-edge frontend technologies."
      />

      <SectionContent>
        <div className={clsx('flex', 'lg:gap-12')}>
          {/* Desktop sidebar */}
          <div className={clsx('hidden flex-1 flex-col gap-6 pt-8', 'lg:flex')}>
            {/* SkyLab Projects */}
            <div className="space-y-2">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-md dark:bg-[#131558] dark:shadow-gray-900/50">
                  <Image
                    src="/assets/images/skylab-logo.webp"
                    alt="SkyLab Technologies logo"
                    width={70}
                    height={70}
                    className="h-[60px] w-[60px] object-contain dark:brightness-0 dark:invert"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  SKYLAB INNOGRAM
                </h3>
              </div>
              <div className={clsx('flex flex-col gap-3')}>
                {projectGroups.skylab.map((key) => {
                  const project = projectData[key as ProjectType];
                  const colors = getColorClasses(project.color);
                  return (
                    <SectionButton
                      key={key}
                      title={project.title}
                      icon={
                        project.iconImage ? (
                          <div
                            className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full p-2 shadow-lg"
                            style={{
                              backgroundColor: project.iconBg || '#ffffff',
                            }}
                          >
                            <Image
                              src={project.iconImage}
                              alt={`${project.title} icon`}
                              width={48}
                              height={48}
                              className="h-12 w-12 object-contain"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br shadow-lg [&>svg]:text-[black] [&>svg]:dark:text-white ${colors.iconGradient} ${colors.iconShadow}`}
                          >
                            {project.icon}
                          </div>
                        )
                      }
                      description={project.description}
                      active={currentState === (key as ProjectType)}
                      onClick={() => setCurrentState(key as ProjectType)}
                    />
                  );
                })}
              </div>
            </div>

            {/* WOWI Projects */}
            <div className="space-y-2">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-md dark:bg-[#0877bf] dark:shadow-gray-900/50">
                  <Image
                    src="/assets/images/wowi-logo.webp"
                    alt="WOWI Solutions logo"
                    width={70}
                    height={70}
                    className="h-[60px] w-[60px] object-contain dark:brightness-0 dark:invert"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  WOWI VIETNAM
                </h3>
              </div>
              <div className={clsx('flex flex-col gap-3')}>
                {projectGroups.wowi.map((key) => {
                  const project = projectData[key as ProjectType];
                  const colors = getColorClasses(project.color);
                  return (
                    <SectionButton
                      key={key}
                      title={project.title}
                      icon={
                        project.iconImage ? (
                          <div
                            className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full p-2 shadow-lg"
                            style={{
                              backgroundColor: project.iconBg || '#ffffff',
                            }}
                          >
                            <Image
                              src={project.iconImage}
                              alt={`${project.title} icon`}
                              width={48}
                              height={48}
                              className="h-12 w-12 object-contain"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br shadow-lg [&>svg]:text-[black] [&>svg]:dark:text-white ${colors.iconGradient} ${colors.iconShadow}`}
                          >
                            {project.icon}
                          </div>
                        )
                      }
                      description={project.description}
                      active={currentState === (key as ProjectType)}
                      onClick={() => setCurrentState(key as ProjectType)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className={clsx('w-full', 'lg:w-auto')}>
            <div className={clsx('-mt-[41px]')}>
              <div className={clsx('w-full', 'lg:h-fit lg:w-[600px]')}>
                <AppWindow
                  type="browser"
                  browserTabs={Object.entries(projectData).map(
                    ([key, project]) => ({
                      icon: project.iconImage ? (
                        <div
                          className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full"
                          style={{
                            backgroundColor: project.iconBg || '#ffffff',
                          }}
                        >
                          <Image
                            src={project.iconImage}
                            alt={`${project.title} icon`}
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                          style={{
                            backgroundColor:
                              project.iconBg ||
                              `rgb(var(--color-${project.color}-500))`,
                          }}
                        >
                          {project.title[0]}
                        </div>
                      ),
                      title: project.fullTitle,
                      isActive: currentState === (key as ProjectType),
                      onClick: () => setCurrentState(key as ProjectType),
                    })
                  )}
                >
                  <ProjectDetail project={currentProject} />
                </AppWindow>
              </div>
            </div>
          </div>
        </div>
      </SectionContent>
    </>
  );
}

export default ProjectsContents;
