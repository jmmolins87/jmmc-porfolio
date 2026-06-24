import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { Badge } from '../ui/badge';
import { fadeUp, scaleIn, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  image: string;
}

const projects: Project[] = [
  {
    title: 'Banco Santander',
    description: 'Aplicación web bancaria para desktop y dispositivos móviles con Angular y Material UI.',
    tags: ['Angular', 'TypeScript', 'Material UI', 'Tailwind'],
    image: '/projects/banco_santander.png',
  },
  {
    title: 'Almirall',
    description: 'Plataforma digital para la compañía farmacéutica internacional.',
    tags: ['Angular', 'TypeScript', 'SASS'],
    image: '/projects/almirall.png',
  },
  {
    title: 'FC Barcelona',
    description: 'Plataforma web para el Barça con integración de servicios y contenido dinámico.',
    tags: ['Angular', 'TypeScript', 'Node.js'],
    image: '/projects/fcbarcelona.png',
  },
  {
    title: 'La Masía FCB',
    description: 'Plataforma formativa y de gestión para La Masía del FC Barcelona.',
    tags: ['Angular', 'TypeScript', 'UI/UX'],
    image: '/projects/lamasia_fcb.png',
  },
  {
    title: 'Mapfre',
    description: 'Solución digital para la aseguradora con portal de clientes y gestión de pólizas.',
    tags: ['Angular', 'TypeScript', 'SASS'],
    image: '/projects/mapfre.png',
  },
  {
    title: 'Unicaja',
    description: 'Aplicación bancaria digital con gestión de productos y servicios financieros.',
    tags: ['Angular', 'TypeScript', 'Tailwind'],
    image: '/projects/unicaja.png',
  },
  {
    title: 'Jazztel',
    description: 'Portal web para el operador de telecomunicaciones con autogestión de clientes.',
    tags: ['Angular', 'JavaScript', 'HTML5'],
    image: '/projects/jazztel.png',
  },
  {
    title: 'Eleia',
    description: 'Plataforma educativa digital con gestión de cursos y contenido multimedia.',
    tags: ['Angular', 'TypeScript', 'Node.js'],
    image: '/projects/eleia.png',
  },
  {
    title: 'Clinvetia',
    description: 'Software de gestión clínica veterinaria con historiales y agenda digital.',
    tags: ['Angular', 'TypeScript', 'UI/UX'],
    image: '/projects/clinvetia.png',
  },
  {
    title: 'Dimática',
    description: 'Aplicación empresarial para la gestión de proyectos y recursos.',
    tags: ['Angular', 'Material UI', 'SASS'],
    image: '/projects/dimatica.png',
  },
  {
    title: 'ESMUC',
    description: 'Plataforma para la Escuela Superior de Música de Cataluña con gestión académica.',
    tags: ['Angular', 'TypeScript', 'Tailwind'],
    image: '/projects/esmuc.png',
  },
  {
    title: 'Flor de Loto',
    description: 'E-commerce y web corporativa para la marca de complementos.',
    tags: ['Angular', 'JavaScript', 'CSS'],
    image: '/projects/flordloto.png',
  },
  {
    title: 'Sermicro',
    description: 'Portal corporativo para la empresa de servicios informáticos.',
    tags: ['Angular', 'TypeScript', 'SASS'],
    image: '/projects/sermicro.png',
  },
  {
    title: 'Servegraf',
    description: 'Web corporativa y plataforma de servicios gráficos online.',
    tags: ['Angular', 'JavaScript', 'HTML5'],
    image: '/projects/servegraf.png',
  },
  {
    title: 'PM Balaguer',
    description: 'Plataforma de gestión para la empresa de ingeniería y proyectos.',
    tags: ['Angular', 'TypeScript', 'Tailwind'],
    image: '/projects/pm_balaguer.png',
  },
  {
    title: 'API Platform',
    description: 'Plataforma de integración y gestión de APIs para servicios empresariales.',
    tags: ['Angular', 'Node.js', 'TypeScript'],
    image: '/projects/api.png',
  },
  {
    title: 'JMMC Dev',
    description: 'Entorno de desarrollo y showcase de componentes frontend reutilizables.',
    tags: ['Angular', 'Storybook', 'TypeScript'],
    image: '/projects/jmmcDev.png',
  },
  {
    title: 'JMMC Legacy',
    description: 'Versión legacy del portfolio y proyectos anteriores.',
    tags: ['Angular', 'JavaScript', 'HTML5'],
    image: '/projects/jmmc_legacy.png',
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={scaleIn}
      className="group relative"
    >
      <a
        href={project.url ?? '#'}
        target={project.url ? '_blank' : undefined}
        rel={project.url ? 'noopener noreferrer' : undefined}
        className="block"
      >
        <div className={cn(
          'relative h-48 rounded-2xl overflow-hidden mb-4',
          'border border-border bg-card'
        )}>
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            width="400"
            height="192"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-sm font-medium flex items-center gap-2">
              {project.title}
              <ExternalLink className="h-4 w-4" />
            </span>
          </div>
        </div>

        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </a>
    </motion.div>
  );
}

export default function Projects({ locale }: Props) {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="section-title"
        >
          {t(locale, 'projects.title')}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 gap-8"
        >
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
