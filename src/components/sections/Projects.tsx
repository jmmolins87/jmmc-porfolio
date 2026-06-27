import { useRef } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';

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
  }
];

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }

  return (
    <motion.div
      variants={scaleIn}
      className="group relative"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: 'preserve-3d' }}
      >
      <a
        href={project.url ?? '#'}
        target={project.url ? '_blank' : undefined}
        rel={project.url ? 'noopener noreferrer' : undefined}
        className="block"
      >
        <Card className="overflow-hidden border-border bg-card transition-all duration-200 hover:shadow-lg">
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
            <motion.img
              src={project.image}
              alt={project.title}
              loading="lazy"
              width="400"
              height="192"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.25 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                {project.title}
                <ExternalLink className="h-4 w-4" />
              </span>
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="font-semibold group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {project.description}
            </p>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </a>
      </div>
    </motion.div>
  );
}

export default function Projects({ locale }: Props) {
  return (
    <section id="projects" className="relative pb-24 md:pb-32">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="section-title !mb-0"
        >
          {t(locale, 'projects.title')}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="grid sm:grid-cols-2 gap-8"
          style={{ perspective: '800px' }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-muted-foreground text-center italic mt-10"
        >
          {t(locale, 'projects.footer')}
        </motion.p>
      </div>
    </section>
  );
}
