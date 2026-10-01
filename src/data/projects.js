import business1 from '../assets/projects/business-1.jpg'
import business2 from '../assets/projects/business-2.jpg'
import business3 from '../assets/projects/business-3.jpg'
import careers1 from '../assets/projects/careers-1.jpg'
import careers2 from '../assets/projects/careers-2.jpg'
import careers3 from '../assets/projects/careers-3.jpg'
import careers4 from '../assets/projects/careers-4.jpg'
import companyProfile1 from '../assets/projects/company-profile-1.jpg'
import companyProfile2 from '../assets/projects/company-profile-2.jpg'
import companyProfile3 from '../assets/projects/company-profile-3.jpg'
import companyProfile4 from '../assets/projects/company-profile-4.jpg'
import jobApply1 from '../assets/projects/job-apply-1.jpg'
import jobApply2 from '../assets/projects/job-apply-2.jpg'

export const projects = [
  {
    id: 'careers',
    name: 'Permata Indonesia Careers',
    subtitle: 'Job listings for job seekers across Indonesia',
    url: 'https://karir.permataindonesia.com/',
    initials: 'PC',
    description:
      "Permata Indonesia's careers site, where job seekers across Indonesia find open positions and outsourced workers (TKO) sign up to apply.",
    role: [
      'Sliced the FAQ section on the home page, and the login and register pages that outsourced workers (TKO) use to sign up, from design into React components styled with SCSS.',
      'Wired these pages to the backend API.',
    ],
    tech: ['React', 'SCSS'],
    screenshots: [
      { src: careers1, alt: 'Permata Indonesia Careers – home page', width: 1280, height: 800 },
      { src: careers2, alt: 'Permata Indonesia Careers – FAQ section', width: 1280, height: 800 },
      { src: careers3, alt: 'Permata Indonesia Careers – login page', width: 1280, height: 800 },
      { src: careers4, alt: 'Permata Indonesia Careers – register page', width: 1280, height: 800 },
    ],
  },
  {
    id: 'job-apply',
    name: 'Permata Job Apply',
    subtitle: 'Apply for jobs straight from social media links',
    url: 'https://karir.permataindonesia.com/apply',
    initials: 'PJ',
    description:
      'The job application page Permata Indonesia shares on social media, where job seekers fill in their details and apply for an open position.',
    role: [
      'Sliced the application page from design into React components styled with SCSS.',
      'Wired the form to the backend API so applications are submitted.',
    ],
    tech: ['React', 'SCSS'],
    screenshots: [
      { src: jobApply1, alt: 'Permata Job Apply – application form on desktop', width: 1280, height: 800 },
      { src: jobApply2, alt: 'Permata Job Apply – application form on mobile', width: 780, height: 1688 },
    ],
  },
  {
    id: 'company-profile',
    name: 'Permata Indonesia Company Profile',
    subtitle: 'Who Permata Indonesia is and what it offers',
    url: 'https://permataindonesia.com/',
    initials: 'PI',
    description:
      'The public company profile of Permata Indonesia, introducing the company, its values and its HR services.',
    role: [
      'Sliced several sections of the site from design into React and SCSS: Home, Our Values, About Us and Our Service.',
    ],
    tech: ['React', 'SCSS'],
    screenshots: [
      { src: companyProfile1, alt: 'Permata Indonesia Company Profile – Home section', width: 1280, height: 800 },
      { src: companyProfile2, alt: 'Permata Indonesia Company Profile – Our Values section', width: 1280, height: 800 },
      { src: companyProfile3, alt: 'Permata Indonesia Company Profile – About Us section', width: 1280, height: 800 },
      { src: companyProfile4, alt: 'Permata Indonesia Company Profile – Our Service section', width: 1280, height: 800 },
    ],
  },
  {
    id: 'business',
    name: 'Permata Indonesia Business',
    subtitle: 'HR services portal for business clients',
    url: 'https://business.permataindonesia.com',
    initials: 'PB',
    description:
      "A site for Permata Indonesia's business clients, with a client dashboard and an outsourcing service simulation.",
    role: [
      'Sliced the landing page from design into React components styled with SCSS.',
      'Wired the page to the backend API.',
    ],
    tech: ['React', 'SCSS'],
    screenshots: [
      { src: business1, alt: 'Permata Indonesia Business – landing page', width: 1280, height: 800 },
      { src: business2, alt: 'Permata Indonesia Business – our advantages section', width: 1280, height: 800 },
      { src: business3, alt: 'Permata Indonesia Business – services section', width: 1280, height: 800 },
    ],
  },
]
