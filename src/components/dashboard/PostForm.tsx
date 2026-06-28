import { useState, lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { Save, EyeOff } from 'lucide-react';
import { Input, Textarea, Label, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/dashboard/ImageUpload';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

interface PostData {
  id?: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  contentEs: string;
  contentEn: string;
  coverImage: string;
  tags: string[];
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
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');

  const [titleEs, setTitleEs] = useState(initialData?.titleEs ?? '');
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? '');
  const [descriptionEs, setDescriptionEs] = useState(initialData?.descriptionEs ?? '');
  const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn ?? '');
  const [contentEs, setContentEs] = useState(initialData?.contentEs ?? '');
  const [contentEn, setContentEn] = useState(initialData?.contentEn ?? '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? '');
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );

  const slug = slugify(titleEs || titleEn);
  const readTimeEs = calcReadTime(contentEs);
  const readTimeEn = calcReadTime(contentEn);

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
    if (!titleEs.trim() && !titleEn.trim()) {
      toast.error('Al menos un título es obligatorio');
      return;
    }
    if (!contentEs.trim() && !contentEn.trim()) {
      toast.error('Al menos un contenido es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        titleEs: titleEs.trim() || titleEn.trim(),
        titleEn: titleEn.trim() || titleEs.trim(),
        descriptionEs: descriptionEs.trim() || null,
        descriptionEn: descriptionEn.trim() || null,
        contentEs: contentEs || contentEn,
        contentEn: contentEn || contentEs,
        coverImage: coverImage || null,
        tags,
        readTimeEs,
        readTimeEn,
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
          <Label htmlFor="titleEs">Título ES *</Label>
          <Input
            id="titleEs"
            value={titleEs}
            onChange={(e) => setTitleEs(e.target.value)}
            placeholder="Título en español"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="titleEn">Título EN *</Label>
          <Input
            id="titleEn"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="English title"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Slug (auto)</Label>
        <Input value={slug} disabled className="font-mono text-sm" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
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
          <Label>Tiempo lectura ES</Label>
          <Input value={readTimeEs} disabled className="text-sm" />
        </div>
        <div className="space-y-2">
          <Label>Tiempo lectura EN</Label>
          <Input value={readTimeEn} disabled className="text-sm" />
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

      <div className="space-y-2">
        <div className="flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab('es')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'es'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Español
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'en'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            English
          </button>
        </div>

        <div className={cn(activeTab !== 'es' && 'hidden')}>
          <Label htmlFor="descEs">Descripción ES</Label>
          <Textarea
            id="descEs"
            value={descriptionEs}
            onChange={(e) => setDescriptionEs(e.target.value)}
            placeholder="Breve descripción en español"
            rows={2}
            className="mb-4"
          />
          <Label>Contenido ES *</Label>
          <div data-color-mode="dark">
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center border border-border rounded-xl bg-muted">Cargando editor...</div>}>
              <MDEditor
                value={contentEs}
                onChange={(val) => setContentEs(val ?? '')}
                height={400}
                preview="live"
              />
            </Suspense>
          </div>
        </div>

        <div className={cn(activeTab !== 'en' && 'hidden')}>
          <Label htmlFor="descEn">Descripción EN</Label>
          <Textarea
            id="descEn"
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="Brief description in English"
            rows={2}
            className="mb-4"
          />
          <Label>Contenido EN *</Label>
          <div data-color-mode="dark">
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center border border-border rounded-xl bg-muted">Loading editor...</div>}>
              <MDEditor
                value={contentEn}
                onChange={(val) => setContentEn(val ?? '')}
                height={400}
                preview="live"
              />
            </Suspense>
          </div>
        </div>
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
          {mode === 'create' ? 'Guardar borrador' : 'Save draft'}
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="shimmer"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : mode === 'create' ? 'Publicar' : 'Publish'}
        </Button>
      </div>
    </div>
  );
}
