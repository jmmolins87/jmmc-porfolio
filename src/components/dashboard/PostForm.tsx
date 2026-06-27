import { useState, lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { Save, Eye, EyeOff } from 'lucide-react';
import { Input, Textarea, Label, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import ImageUpload from './ImageUpload';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

interface PostData {
  id?: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  tags: string[];
  lang: 'es' | 'en';
  isPublished: boolean;
  publishedAt: string;
}

interface Props {
  initialData?: PostData;
  mode: 'create' | 'edit';
}

function calcReadTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function PostForm({ initialData, mode }: Props) {
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? '');
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [lang, setLang] = useState<'es' | 'en'>(initialData?.lang ?? 'es');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );

  const slug = slugify(title);
  const readTime = calcReadTime(content);

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(publish: boolean) {
    if (!title.trim() || !content.trim()) {
      toast.error('Título y contenido son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        content,
        coverImage: coverImage || null,
        tags,
        lang,
        isPublished: publish,
        publishedAt: new Date(publishedAt).toISOString(),
      };

      const url = mode === 'edit' && initialData?.id
        ? `/api/posts/${initialData.id}`
        : '/api/posts';

      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar');
      }

      toast.success(mode === 'edit' ? 'Post actualizado' : 'Post creado');
      window.location.href = '/dashboard/blog';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mi artículo"
          />
        </div>
        <div className="space-y-2">
          <Label>Slug (auto)</Label>
          <Input value={slug} disabled className="font-mono text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descripción del artículo"
          rows={2}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Idioma</Label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="lang"
                value="es"
                checked={lang === 'es'}
                onChange={() => setLang('es')}
                className="accent-primary"
              />
              <span className="text-sm">ES</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="lang"
                value="en"
                checked={lang === 'en'}
                onChange={() => setLang('en')}
                className="accent-primary"
              />
              <span className="text-sm">EN</span>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Fecha publicación</Label>
          <Input
            id="date"
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Tiempo lectura</Label>
          <Input value={readTime} disabled className="text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Añadir tag..."
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addTag}>+</Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" className="text-xs gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Imagen de portada</Label>
        <ImageUpload value={coverImage} onChange={setCoverImage} />
      </div>

      <div className="space-y-2" data-color-mode="dark">
        <Label>Contenido (Markdown) *</Label>
        <Suspense fallback={<div className="h-[400px] flex items-center justify-center border border-border rounded-xl bg-muted">Cargando editor...</div>}>
          <MDEditor
            value={content}
            onChange={(val) => setContent(val ?? '')}
            height={400}
            preview="live"
          />
        </Suspense>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => handleSubmit(false)}
          disabled={saving}
        >
          <EyeOff className="h-4 w-4 mr-2" />
          Guardar borrador
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="shimmer"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Publicar'}
        </Button>
      </div>
    </div>
  );
}
