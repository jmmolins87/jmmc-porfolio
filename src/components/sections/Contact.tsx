import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Send } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, TwitterIcon, MailIcon } from '../ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email({ message: 'Invalid email' }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

interface Props {
  locale: Locale;
}

export default function Contact({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-container">
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]),
            y: useTransform(scrollYProgress, [0, 0.2], [40, 0]),
          }}
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
            style={{
              opacity: useTransform(scrollYProgress, [0.1, 0.4], [0, 1]),
              y: useTransform(scrollYProgress, [0.1, 0.4], [30, 0]),
            }}
          >
            <div>
              <Input
                placeholder={t(locale, 'contact.name')}
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Input
                type="email"
                placeholder={t(locale, 'contact.email')}
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Textarea
                placeholder={t(locale, 'contact.message')}
                {...register('message')}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
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

            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-500 text-center"
              >
                {t(locale, 'contact.success')}
              </motion.p>
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mt-10"
          >
            {[
              { icon: MailIcon, href: 'mailto:hello@jmmc.dev', label: 'Email' },
              { icon: GitHubIcon, href: 'https://github.com/juanmamc', label: 'GitHub' },
              { icon: LinkedInIcon, href: 'https://linkedin.com/in/juanmamc', label: 'LinkedIn' },
              { icon: TwitterIcon, href: 'https://twitter.com/juanmamc', label: 'Twitter' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
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
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
