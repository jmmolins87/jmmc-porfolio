import { useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Trash2, Eye, Calendar, Clock, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  tags: string[];
  readTime: string | null;
  publishedAt: string;
  lang: string;
  isPublished: boolean;
}

interface PostGroup {
  groupKey: string;
  es: Post | null;
  en: Post | null;
}

interface Props {
  groups: PostGroup[];
  onDelete: (id: string) => void;
}

export default function PostList({ groups, onDelete }: Props) {
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

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay artículos aún. Crea el primero.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group, i) => {
        const post = group.es ?? group.en;
        if (!post) return null;

        return (
          <motion.div
            key={group.groupKey}
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
                alt={post.title}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <span className="text-xl">📝</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{post.title}</h3>
                {!group.es && (
                  <Badge variant="outline" className="text-xs shrink-0">EN</Badge>
                )}
                {!group.en && (
                  <Badge variant="outline" className="text-xs shrink-0">ES</Badge>
                )}
                {group.es && group.en && (
                  <Badge variant="outline" className="text-xs shrink-0 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> ES / EN
                  </Badge>
                )}
                {(!group.es || !group.en) && (
                  <Badge variant="secondary" className="text-xs shrink-0">Sin traducir</Badge>
                )}
                {!post.isPublished && (
                  <Badge variant="secondary" className="text-xs shrink-0">Borrador</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString('es-ES')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
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
              {group.es && (
                <a
                  href={`/dashboard/blog/${group.es.id}/edit`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                  title="Editar ES"
                >
                  <Pencil className="h-4 w-4" />
                </a>
              )}
              {group.en && (
                <a
                  href={`/dashboard/blog/${group.en.id}/edit`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                  title="Editar EN"
                >
                  <Pencil className="h-4 w-4" />
                </a>
              )}
              {post.slug && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </a>
              )}
              {group.es && (
                <button
                  onClick={() => handleDelete(group.es!.id, group.es!.title)}
                  disabled={deleting === group.es.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              {group.en && (
                <button
                  onClick={() => handleDelete(group.en!.id, group.en!.title)}
                  disabled={deleting === group.en.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
