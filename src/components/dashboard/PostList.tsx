import { useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  coverImage: string | null;
  tags: string[];
  readTimeEs: string | null;
  readTimeEn: string | null;
  publishedAt: string;
  isPublished: boolean;
}

interface Props {
  posts: Post[];
  lang: 'es' | 'en';
  onDelete: (id: string) => void;
}

export default function PostList({ posts, lang, onDelete }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      onDelete(id);
    } catch {
      alert('Error al eliminar el post');
    } finally {
      setDeleting(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{lang === 'es' ? 'No hay artículos aún. Crea el primero.' : 'No articles yet. Create the first one.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            'flex items-center gap-4 p-4 rounded-xl border border-border bg-card',
            'hover:border-primary/20 transition-all'
          )}
        >
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.titleEs}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <span className="text-xl">📝</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{post.titleEs}</h3>
              <Badge variant="outline" className="text-xs shrink-0">ES</Badge>
              {post.titleEn && (
                <Badge variant="outline" className="text-xs shrink-0">EN</Badge>
              )}
              {!post.isPublished && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {lang === 'es' ? 'Borrador' : 'Draft'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lang === 'es' ? post.readTimeEs : post.readTimeEn}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="default" className="text-[10px]">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-1.5 shrink-0">
            <a
              href={`/dashboard/blog/${post.id}/edit`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </a>
            <a
              href={`/${lang}/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Eye className="h-4 w-4" />
            </a>
            <button
              onClick={() => handleDelete(post.id, post.titleEs)}
              disabled={deleting === post.id}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
