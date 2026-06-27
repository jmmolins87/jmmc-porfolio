import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { GithubIcon, LinkedInIcon } from '@/lib/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { Button, Input, Textarea, Label } from '@/components/ui';
import { cn } from '@/lib/utils';
import { fadeUp, slideUp, scaleInSpring, staggerContainer } from '@/lib/animations';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email({ message: 'Invalid email' }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

interface ContactForm extends z.infer<typeof contactSchema> {}

interface Props {
  locale: Locale;
}

function Confetti() {
  const colors = [
    'var(--color-primary)',
    'var(--color-accent)',
    'var(--color-secondary)',
    '#ff6b6b',
    '#4ecdc4',
    '#ffe66d',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 8;
        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${x}%`,
              top: '-10px',
              width: size,
              height: size * 0.6,
              backgroundColor: color,
              rotate: Math.random() * 360,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
            initial={{ y: -20, opacity: 1 }}
            animate={{
              y: ['0vh', '100vh'],
              rotate: [0, 720 + Math.random() * 360],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              repeatDelay: 3 + Math.random() * 2,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Contact({ locale }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactForm) {
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        toast.success(t(locale, 'contact.success'));
        reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        toast.error(t(locale, 'contact.error'));
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      toast.error(t(locale, 'contact.connectionError'));
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center">
      <div className="section-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="section-title">{t(locale, 'contact.title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(locale, 'contact.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
          >
            <motion.div variants={slideUp}>
              <Label htmlFor="contact-name" className="block mb-2 text-sm font-medium">
                {t(locale, 'contact.name')}
              </Label>
              <Input
                id="contact-name"
                placeholder={t(locale, 'contact.name')}
                {...register('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={slideUp}>
              <Label htmlFor="contact-email" className="block mb-2 text-sm font-medium">
                {t(locale, 'contact.email')}
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder={t(locale, 'contact.email')}
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={slideUp}>
              <Label htmlFor="contact-message" className="block mb-2 text-sm font-medium">
                {t(locale, 'contact.message')}
              </Label>
              <Textarea
                id="contact-message"
                placeholder={t(locale, 'contact.message')}
                {...register('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={cn(errors.message && 'border-destructive')}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-destructive mt-1">
                  {errors.message.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={slideUp}>
              <Button
              type="submit"
              size="lg"
              className="w-full shimmer"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⟳</span>
                  {t(locale, 'contact.sending')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t(locale, 'contact.send')}
                </span>
              )}
            </Button>
            </motion.div>

            {status === 'success' && (
              <>
                <Confetti />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-500 text-center"
                >
                  {t(locale, 'contact.success')}
                </motion.p>
              </>
            )}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive text-center"
              >
                {t(locale, 'contact.error')}
              </motion.p>
            )}
          </motion.form>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            className="flex justify-center gap-4 mt-10"
          >
{[
              { icon: Mail, href: 'mailto:hello@jmmc.dev', label: 'Email' },
              { icon: GithubIcon, href: 'https://github.com/juanmamc', label: 'GitHub' },
              { icon: LinkedInIcon, href: 'https://linkedin.com/in/juanmamc', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                variants={scaleInSpring}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl',
                  'border border-border bg-card hover:bg-muted transition-all duration-200',
                  'hover:glow-sm hover:-translate-y-1'
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
