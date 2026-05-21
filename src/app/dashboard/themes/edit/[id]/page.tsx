'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/data-context';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemePreview } from '@/components/theme-preview';
import { CURATED_FONTS } from '@/lib/report-fonts';
import {
  cloneTheme,
  isBuiltinThemeId,
  type ReportTheme,
  type ReportThemeColors,
} from '@/lib/report-themes';
import { ChevronLeft, Save } from '@/components/icons';

const COLOR_FIELDS: Array<{ key: keyof ReportThemeColors; labelEn: string; labelEs: string }> = [
  { key: 'background', labelEn: 'Background', labelEs: 'Fondo' },
  { key: 'foreground', labelEn: 'Text', labelEs: 'Texto' },
  { key: 'card', labelEn: 'Card', labelEs: 'Tarjeta' },
  { key: 'cardForeground', labelEn: 'Card text', labelEs: 'Texto de tarjeta' },
  { key: 'muted', labelEn: 'Muted', labelEs: 'Atenuado' },
  { key: 'mutedForeground', labelEn: 'Muted text', labelEs: 'Texto atenuado' },
  { key: 'border', labelEn: 'Border', labelEs: 'Borde' },
  { key: 'primary', labelEn: 'Primary', labelEs: 'Primario' },
  { key: 'primaryForeground', labelEn: 'Primary text', labelEs: 'Texto primario' },
  { key: 'brand', labelEn: 'Brand', labelEs: 'Marca' },
  { key: 'brandForeground', labelEn: 'Brand text', labelEs: 'Texto de marca' },
  { key: 'severityCritical', labelEn: 'Critical', labelEs: 'Crítico' },
  { key: 'severityHigh', labelEn: 'High', labelEs: 'Alto' },
  { key: 'severityMedium', labelEn: 'Medium', labelEs: 'Medio' },
  { key: 'severityLow', labelEn: 'Low', labelEs: 'Bajo' },
  { key: 'severityInformational', labelEn: 'Info', labelEs: 'Info' },
  { key: 'todo', labelEn: 'TODO marker', labelEs: 'Marcador TODO' },
  { key: 'surfaceCover', labelEn: 'Hero surface', labelEs: 'Superficie hero' },
  { key: 'surfaceCardStrong', labelEn: 'Strong card', labelEs: 'Tarjeta intensa' },
];

// "H S% L%" → "#RRGGBB"
function hslChannelsToHex(channels: string): string {
  const match = channels.trim().match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!match) return '#000000';
  const h = Number(match[1]);
  const s = Number(match[2]) / 100;
  const l = Number(match[3]) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(c * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHslChannels(hex: string): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const hex = hslChannelsToHex(value);
  return (
    <div className="grid grid-cols-[1fr_auto_120px] items-center gap-2">
      <span className="text-xs text-muted-foreground truncate">{label}</span>
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(hexToHslChannels(e.target.value))}
        className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0"
        aria-label={label}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 font-mono text-xs"
        spellCheck={false}
      />
    </div>
  );
}

export default function ThemeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { getThemeById, updateTheme } = useData();
  const id = String(params?.id || '');

  const original = getThemeById(id);
  const [draft, setDraft] = React.useState<ReportTheme>(() => cloneTheme(original));
  const [previewMode, setPreviewMode] = React.useState<'light' | 'dark'>(
    draft.modes === 'dark' ? 'dark' : 'light',
  );

  React.useEffect(() => {
    setDraft(cloneTheme(original));
  }, [original.id]);

  const readonly = isBuiltinThemeId(draft.id);

  const t = {
    en: {
      back: 'Back to themes',
      save: 'Save',
      saved: 'Theme saved',
      readonly: 'Built-in themes are read-only. Duplicate the theme to customise it.',
      tabs: { general: 'General', colors: 'Colors', typography: 'Typography', shape: 'Shape', hero: 'Hero', sidebar: 'Sidebar', components: 'Components' },
      name: 'Name',
      author: 'Author',
      description: 'Description',
      modes: 'Supported modes',
      modeLight: 'Light only',
      modeDark: 'Dark only',
      modeBoth: 'Both',
      lightColors: 'Light colors',
      darkColors: 'Dark colors',
      familyHeadline: 'Headline font',
      familyBody: 'Body font',
      familyMono: 'Monospace font',
      baseSize: 'Body size (px)',
      lineHeight: 'Line height',
      headingScale: 'Heading scale',
      radius: 'Radius (px)',
      borderWidth: 'Border width (px)',
      spacing: 'Spacing density',
      shadow: 'Shadow intensity',
      gradientFrom: 'Gradient from',
      gradientTo: 'Gradient to',
      heroAccent: 'Accent',
      backgroundImage: 'Background image URL',
      overlayColor: 'Overlay color',
      overlayOpacity: 'Overlay opacity',
      logoVariant: 'Logo variant',
      sidebarHighlight: 'Active indicator',
      tocIndent: 'TOC indent (px)',
      badgeShape: 'Badge shape',
      calloutStyle: 'Callout style',
    },
    es: {
      back: 'Volver a temas',
      save: 'Guardar',
      saved: 'Tema guardado',
      readonly: 'Los temas built-in son de solo lectura. Duplica el tema para personalizarlo.',
      tabs: { general: 'General', colors: 'Colores', typography: 'Tipografía', shape: 'Forma', hero: 'Hero', sidebar: 'Sidebar', components: 'Componentes' },
      name: 'Nombre',
      author: 'Autor',
      description: 'Descripción',
      modes: 'Modos soportados',
      modeLight: 'Solo claro',
      modeDark: 'Solo oscuro',
      modeBoth: 'Ambos',
      lightColors: 'Colores claros',
      darkColors: 'Colores oscuros',
      familyHeadline: 'Tipografía titulares',
      familyBody: 'Tipografía cuerpo',
      familyMono: 'Tipografía monoespacio',
      baseSize: 'Tamaño base (px)',
      lineHeight: 'Altura de línea',
      headingScale: 'Escala de titulares',
      radius: 'Radio (px)',
      borderWidth: 'Grosor borde (px)',
      spacing: 'Densidad de spacing',
      shadow: 'Intensidad de sombras',
      gradientFrom: 'Degradado desde',
      gradientTo: 'Degradado hasta',
      heroAccent: 'Acento',
      backgroundImage: 'URL imagen de fondo',
      overlayColor: 'Color overlay',
      overlayOpacity: 'Opacidad overlay',
      logoVariant: 'Variante de logo',
      sidebarHighlight: 'Indicador activo',
      tocIndent: 'Indentación TOC (px)',
      badgeShape: 'Forma del badge',
      calloutStyle: 'Estilo de callout',
    },
  } as const;
  const L = t[language];

  const patchColors = (mode: 'light' | 'dark', key: keyof ReportThemeColors, value: string) => {
    setDraft((d) => ({ ...d, [mode]: { ...d[mode], [key]: value } }));
  };

  const handleSave = () => {
    if (readonly) {
      toast({ variant: 'destructive', title: L.readonly });
      return;
    }
    updateTheme(draft);
    toast({ title: L.saved });
    router.push('/dashboard/themes');
  };

  const fontOptions = CURATED_FONTS.map((f) => ({ label: f.family, value: f.family }));

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button variant="ghost" asChild className="h-9">
          <Link href="/dashboard/themes">
            <ChevronLeft className="h-4 w-4 mr-1" />{L.back}
          </Link>
        </Button>
        <Button onClick={handleSave} disabled={readonly} className="h-10">
          <Save className="h-4 w-4 mr-2" />{L.save}
        </Button>
      </div>
      {readonly && (
        <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          {L.readonly}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Tabs defaultValue="general">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="general">{L.tabs.general}</TabsTrigger>
            <TabsTrigger value="colors">{L.tabs.colors}</TabsTrigger>
            <TabsTrigger value="typography">{L.tabs.typography}</TabsTrigger>
            <TabsTrigger value="shape">{L.tabs.shape}</TabsTrigger>
            <TabsTrigger value="hero">{L.tabs.hero}</TabsTrigger>
            <TabsTrigger value="sidebar">{L.tabs.sidebar}</TabsTrigger>
            <TabsTrigger value="components">{L.tabs.components}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card><CardContent className="grid gap-4 pt-6">
              <Field label={L.name}><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} disabled={readonly} /></Field>
              <Field label={L.author}><Input value={draft.author || ''} onChange={(e) => setDraft({ ...draft, author: e.target.value })} disabled={readonly} /></Field>
              <Field label={L.description}><Textarea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} disabled={readonly} rows={3} /></Field>
              <Field label={L.modes}>
                <Select value={draft.modes} onValueChange={(v) => setDraft({ ...draft, modes: v as ReportTheme['modes'] })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{L.modeLight}</SelectItem>
                    <SelectItem value="dark">{L.modeDark}</SelectItem>
                    <SelectItem value="both">{L.modeBoth}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">{L.lightColors}</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {COLOR_FIELDS.map((f) => (
                  <ColorRow key={`light-${String(f.key)}`} label={language === 'es' ? f.labelEs : f.labelEn} value={draft.light[f.key]} onChange={(v) => !readonly && patchColors('light', f.key, v)} />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">{L.darkColors}</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {COLOR_FIELDS.map((f) => (
                  <ColorRow key={`dark-${String(f.key)}`} label={language === 'es' ? f.labelEs : f.labelEn} value={draft.dark[f.key]} onChange={(v) => !readonly && patchColors('dark', f.key, v)} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography">
            <Card><CardContent className="grid gap-4 pt-6">
              <Field label={L.familyHeadline}>
                <Select value={draft.typography.familyHeadline} onValueChange={(v) => setDraft({ ...draft, typography: { ...draft.typography, familyHeadline: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{fontOptions.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
                </Select>
              </Field>
              <Field label={L.familyBody}>
                <Select value={draft.typography.familyBody} onValueChange={(v) => setDraft({ ...draft, typography: { ...draft.typography, familyBody: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{fontOptions.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
                </Select>
              </Field>
              <Field label={L.familyMono}>
                <Select value={draft.typography.familyMono} onValueChange={(v) => setDraft({ ...draft, typography: { ...draft.typography, familyMono: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{fontOptions.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
                </Select>
              </Field>
              <Field label={`${L.baseSize}: ${draft.typography.baseSize}px`}>
                <Slider min={12} max={20} step={1} value={[draft.typography.baseSize]} onValueChange={([v]) => setDraft({ ...draft, typography: { ...draft.typography, baseSize: v } })} disabled={readonly} />
              </Field>
              <Field label={`${L.lineHeight}: ${draft.typography.lineHeight.toFixed(2)}`}>
                <Slider min={1.2} max={2} step={0.05} value={[draft.typography.lineHeight]} onValueChange={([v]) => setDraft({ ...draft, typography: { ...draft.typography, lineHeight: v } })} disabled={readonly} />
              </Field>
              <Field label={L.headingScale}>
                <Select value={draft.typography.headingScale} onValueChange={(v: any) => setDraft({ ...draft, typography: { ...draft.typography, headingScale: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">compact</SelectItem>
                    <SelectItem value="cozy">cozy</SelectItem>
                    <SelectItem value="roomy">roomy</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="shape">
            <Card><CardContent className="grid gap-4 pt-6">
              <Field label={`${L.radius}: ${draft.shape.radius}px`}>
                <Slider min={0} max={24} step={1} value={[draft.shape.radius]} onValueChange={([v]) => setDraft({ ...draft, shape: { ...draft.shape, radius: v } })} disabled={readonly} />
              </Field>
              <Field label={`${L.borderWidth}: ${draft.shape.borderWidth}px`}>
                <Slider min={0} max={3} step={1} value={[draft.shape.borderWidth]} onValueChange={([v]) => setDraft({ ...draft, shape: { ...draft.shape, borderWidth: v } })} disabled={readonly} />
              </Field>
              <Field label={L.spacing}>
                <Select value={draft.shape.spacing} onValueChange={(v: any) => setDraft({ ...draft, shape: { ...draft.shape, spacing: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">compact</SelectItem>
                    <SelectItem value="cozy">cozy</SelectItem>
                    <SelectItem value="roomy">roomy</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={L.shadow}>
                <Select value={draft.shape.shadow} onValueChange={(v: any) => setDraft({ ...draft, shape: { ...draft.shape, shadow: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">none</SelectItem>
                    <SelectItem value="subtle">subtle</SelectItem>
                    <SelectItem value="soft">soft</SelectItem>
                    <SelectItem value="strong">strong</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card><CardContent className="grid gap-2 pt-6">
              <ColorRow label={L.gradientFrom} value={draft.hero.gradientFrom} onChange={(v) => !readonly && setDraft({ ...draft, hero: { ...draft.hero, gradientFrom: v } })} />
              <ColorRow label={L.gradientTo} value={draft.hero.gradientTo} onChange={(v) => !readonly && setDraft({ ...draft, hero: { ...draft.hero, gradientTo: v } })} />
              <ColorRow label={L.heroAccent} value={draft.hero.accent} onChange={(v) => !readonly && setDraft({ ...draft, hero: { ...draft.hero, accent: v } })} />
              <Field label={L.backgroundImage}>
                <Input value={draft.hero.backgroundImage || ''} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, backgroundImage: e.target.value } })} disabled={readonly} placeholder="https://… or data:image/…" />
              </Field>
              <ColorRow label={L.overlayColor} value={draft.hero.overlay.color} onChange={(v) => !readonly && setDraft({ ...draft, hero: { ...draft.hero, overlay: { ...draft.hero.overlay, color: v } } })} />
              <Field label={`${L.overlayOpacity}: ${Math.round(draft.hero.overlay.opacity * 100)}%`}>
                <Slider min={0} max={1} step={0.05} value={[draft.hero.overlay.opacity]} onValueChange={([v]) => setDraft({ ...draft, hero: { ...draft.hero, overlay: { ...draft.hero.overlay, opacity: v } } })} disabled={readonly} />
              </Field>
              <Field label={L.logoVariant}>
                <Select value={draft.hero.logoVariant} onValueChange={(v: any) => setDraft({ ...draft, hero: { ...draft.hero, logoVariant: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="icon">icon</SelectItem>
                    <SelectItem value="wide">wide</SelectItem>
                    <SelectItem value="none">none</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="sidebar">
            <Card><CardContent className="grid gap-4 pt-6">
              <Field label={L.sidebarHighlight}>
                <Select value={draft.sidebarStyle.highlight} onValueChange={(v: any) => setDraft({ ...draft, sidebarStyle: { ...draft.sidebarStyle, highlight: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-bar">brand-bar</SelectItem>
                    <SelectItem value="underline">underline</SelectItem>
                    <SelectItem value="plain">plain</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={`${L.tocIndent}: ${draft.sidebarStyle.tocIndent}px`}>
                <Slider min={4} max={32} step={2} value={[draft.sidebarStyle.tocIndent]} onValueChange={([v]) => setDraft({ ...draft, sidebarStyle: { ...draft.sidebarStyle, tocIndent: v } })} disabled={readonly} />
              </Field>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="components">
            <Card><CardContent className="grid gap-4 pt-6">
              <Field label={L.badgeShape}>
                <Select value={draft.badge.shape} onValueChange={(v: any) => setDraft({ ...draft, badge: { ...draft.badge, shape: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pill">pill</SelectItem>
                    <SelectItem value="square">square</SelectItem>
                    <SelectItem value="flag">flag</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={L.calloutStyle}>
                <Select value={draft.callout.style} onValueChange={(v: any) => setDraft({ ...draft, callout: { ...draft.callout, style: v } })} disabled={readonly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soft">soft</SelectItem>
                    <SelectItem value="outline">outline</SelectItem>
                    <SelectItem value="solid">solid</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent></Card>
          </TabsContent>
        </Tabs>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-2 flex items-center gap-1 rounded-md border bg-muted p-1 w-fit">
            <Button size="sm" variant={previewMode === 'light' ? 'default' : 'ghost'} className="h-7 px-3" onClick={() => setPreviewMode('light')}>Light</Button>
            <Button size="sm" variant={previewMode === 'dark' ? 'default' : 'ghost'} className="h-7 px-3" onClick={() => setPreviewMode('dark')}>Dark</Button>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <ThemePreview theme={draft} mode={previewMode} variant="full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
