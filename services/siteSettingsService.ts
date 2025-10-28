// services/siteSettingsService.ts
import { SiteSettings } from '../types';

// Simulating a database or a configuration file
let siteSettings: SiteSettings = {
  siteName: 'InvestMaroc',
  logoUrl: '/vite.svg', // Placeholder
  heroTitle: {
    fr: 'Investissez dans l’avenir du Maroc',
    ar: 'استثمر في مستقبل المغرب',
  },
  heroSubtitle: {
    fr: 'Soutenez des entrepreneurs locaux et faites fructifier votre capital en toute sécurité.',
    ar: 'ادعم رواد الأعمال المحليين ونمّي رأس مالك بكل أمان.',
  },
  heroImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2138&auto=format&fit=crop',
  heroButton1Text: {
    fr: 'Découvrir les projets',
    ar: 'اكتشف المشاريع',
  },
  heroButton1Url: '/projets',
  heroButton2Text: {
    fr: 'Commencer à investir',
    ar: 'ابدأ الاستثمار',
  },
  heroButton2Url: '/connexion',
  teamSectionTitle: {
    fr: 'Qui Sommes-Nous ?',
    ar: 'من نحن؟',
  },
  teamSectionDescription: {
    fr: "Rencontrez l'équipe passionnée qui travaille pour connecter les investisseurs aux projets qui façonnent l'avenir du Maroc.",
    ar: "تعرف على الفريق الشغوف الذي يعمل على ربط المستثمرين بالمشاريع التي تشكل مستقبل المغرب.",
  },
  servicesPageTitle: {
    fr: 'Nos Services Professionnels',
    ar: 'خدماتنا الاحترافية',
  },
  servicesPageDescription: {
    fr: 'Nous offrons une gamme de services conçus pour aider les porteurs de projet à préparer, lancer et gérer leurs campagnes de financement avec succès.',
    ar: 'نحن نقدم مجموعة من الخدمات المصممة لمساعدة أصحاب المشاريع على إعداد وإطلاق وإدارة حملات التمويل الخاصة بهم بنجاح.',
  },
  teamMembers: [
    {
        id: 'team_1',
        name: 'Admin InvestMaroc',
        role: 'PDG & Fondateur',
        bio: "Visionnaire passionné par la finance et l'impact social, Admin a fondé InvestMaroc pour catalyser l'entrepreneuriat au Maroc.",
        imageUrl: 'https://i.pravatar.cc/150?u=usr_admin1',
        socials: { linkedin: '#', twitter: '#' }
    },
    {
        id: 'team_2',
        name: 'Leila Alaoui',
        role: 'Directrice des Opérations',
        bio: "Avec une expertise en gestion de projet et en optimisation des processus, Leila assure le bon fonctionnement de la plateforme au quotidien.",
        imageUrl: 'https://i.pravatar.cc/150?u=usr_admin2',
        socials: { linkedin: '#', twitter: '#' }
    },
    {
        id: 'team_3',
        name: 'Youssef Alaoui',
        role: 'Responsable des Partenariats',
        bio: "Youssef est le point de contact pour les porteurs de projet, les guidant de l'idée à la campagne de financement réussie.",
        imageUrl: 'https://i.pravatar.cc/150?u=usr_po1',
        socials: { linkedin: '#', twitter: '#' }
    }
  ],
  footer: {
    description: {
        fr: "Investir dans le potentiel marocain.",
        ar: "الاستثمار في الإمكانيات المغربية."
    },
    navigationLinks: [
        { id: 'footer_nav_1', text: { fr: 'Accueil', ar: 'الرئيسية' }, url: '/' },
        { id: 'footer_nav_2', text: { fr: 'Projets', ar: 'المشاريع' }, url: '/projets' },
        { id: 'footer_nav_3', text: { fr: 'À propos', ar: 'من نحن' }, url: '#' },
    ],
    legalLinks: [
        { id: 'footer_legal_1', text: { fr: "Conditions d'utilisation", ar: 'شروط الاستخدام' }, url: '#' },
        { id: 'footer_legal_2', text: { fr: 'Politique de confidentialité', ar: 'سياسة الخصوصية' }, url: '#' },
        { id: 'footer_legal_3', text: { fr: 'Contact', ar: 'اتصل بنا' }, url: '/contact' },
    ],
    socials: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
    }
  },
  // SEO Fields
  seoTitle: "InvestMaroc - Investissez dans l'avenir du Maroc",
  seoDescription: "Découvrez et soutenez des projets marocains prometteurs. InvestMaroc est la plateforme leader pour le financement participatif au Maroc, connectant investisseurs et entrepreneurs.",
  seoKeywords: "investissement maroc, crowdfunding maroc, financement participatif, startup maroc, investir au maroc",
  ogTitle: "InvestMaroc: L'avenir de l'investissement au Maroc",
  ogDescription: "Rejoignez la révolution du financement participatif au Maroc. Soutenez des projets innovants et devenez acteur de la croissance économique.",
  ogImageUrl: 'https://images.unsplash.com/photo-1606231149809-a1854a241183?q=80&w=1200&h=630&auto=format&fit=crop',
  faviconUrl: '/vite.svg',
  // Maintenance Mode Fields
  maintenanceModeEnabled: false,
  maintenanceModeMessage: "Notre site est actuellement en cours de maintenance. Nous serons de retour très bientôt. Merci pour votre patience.",
  // Integrations
  integrations: {
    googleAnalyticsId: '',
    paymentGateway: {
      activeGateway: 'cmi',
      cmi: {
        merchantId: '',
        accessKey: '',
      },
      stripe: {
        publicKey: '',
        secretKey: '',
      },
      paypal: {
        clientId: '',
        clientSecret: '',
      },
      cih: {
        merchantId: '',
        apiKey: '',
      },
    },
    emailService: {
      apiKey: '',
      senderEmail: '',
    },
    cloudStorage: {
      accessKeyId: '',
      secretAccessKey: '',
      bucketName: '',
      region: '',
    },
  },
  // Notification Toggles
  notifications: {
    user: {
      onProjectApproved: true,
      onKycRejected: true,
      onNewInvestment: true,
    },
    admin: {
      onNewProjectPending: true,
      onNewUserRegistered: true,
    },
  },
  // System Settings
  systemSettings: {
    transactions: {
        platformFeePercentage: 5,
        minDeposit: 100,
        maxDeposit: 100000,
        passFeesToUser: true,
    },
    projects: {
        defaultCampaignDurationDays: 60,
        minFundingGoal: 10000,
        maxFundingGoal: 5000000,
        autoRefundOnFailure: true,
    },
    security: {
        passwordMinLength: 8,
        passwordRequiresNumber: true,
        passwordRequiresSymbol: true,
        sessionDurationMinutes: 60,
        twoFactorAuthEnabled: true,
    },
    performance: {
        cacheDurationMinutes: 15,
        enableImageOptimization: true,
    },
  },
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getSiteSettings = async (): Promise<SiteSettings> => {
  await delay(300); // Simulate network delay
  return { ...siteSettings };
};

export const updateSiteSettings = async (newSettings: SiteSettings): Promise<SiteSettings> => {
  await delay(500); // Simulate network delay for an update
  siteSettings = { ...newSettings };
  console.log('Site settings updated:', siteSettings);
  return { ...siteSettings };
};