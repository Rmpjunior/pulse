// Block type definitions

export type BlockType = 
  | 'LINK'
  | 'HIGHLIGHT'
  | 'MEDIA'
  | 'SOCIAL_ICONS'
  | 'TEXT'
  | 'DIVIDER'
  | 'CATALOG'
  | 'FORM';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
  visible: boolean;
}

export interface LinkBlockContent {
  label: string;
  url: string;
  icon?: string;
  style?: 'default' | 'outline' | 'gradient';
}

export interface HighlightBlockContent {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export interface MediaBlockContent {
  mediaType: 'youtube' | 'vimeo' | 'spotify' | 'soundcloud' | 'image';
  embedUrl: string;
  title?: string;
}

export interface SocialIconsBlockContent {
  icons: Array<{
    platform: string;
    url: string;
  }>;
}

export interface TextBlockContent {
  text: string;
  align?: 'left' | 'center' | 'right';
}

export interface DividerBlockContent {
  style?: 'line' | 'dots' | 'space';
}

export interface CatalogBlockContent {
  items: Array<{
    id: string;
    name: string;
    description?: string;
    price?: string;
    image?: string;
    url?: string;
  }>;
}

export interface FormBlockContent {
  title: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'email' | 'textarea';
    required: boolean;
  }>;
  submitLabel: string;
}

export type BlockContent = 
  | LinkBlockContent
  | HighlightBlockContent
  | MediaBlockContent
  | SocialIconsBlockContent
  | TextBlockContent
  | DividerBlockContent
  | CatalogBlockContent
  | FormBlockContent;

export interface Block extends BaseBlock {
  content: BlockContent;
}

// Default content for new blocks
export const defaultBlockContent: Record<BlockType, BlockContent> = {
  LINK: {
    label: 'Meu link',
    url: 'https://',
    style: 'default',
  },
  HIGHLIGHT: {
    title: 'Destaque',
    description: '',
  },
  MEDIA: {
    mediaType: 'youtube',
    embedUrl: '',
  },
  SOCIAL_ICONS: {
    icons: [],
  },
  TEXT: {
    text: '',
    align: 'center',
  },
  DIVIDER: {
    style: 'line',
  },
  CATALOG: {
    items: [],
  },
  FORM: {
    title: 'Contato',
    fields: [
      { id: '1', label: 'Nome', type: 'text', required: true },
      { id: '2', label: 'E-mail', type: 'email', required: true },
      { id: '3', label: 'Mensagem', type: 'textarea', required: true },
    ],
    submitLabel: 'Enviar',
  },
};

// Social platform options
export const socialPlatforms = [
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { id: 'youtube', label: 'YouTube', icon: 'youtube' },
  { id: 'tiktok', label: 'TikTok', icon: 'tiktok' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { id: 'github', label: 'GitHub', icon: 'github' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook' },
  { id: 'twitch', label: 'Twitch', icon: 'twitch' },
  { id: 'discord', label: 'Discord', icon: 'discord' },
  { id: 'telegram', label: 'Telegram', icon: 'telegram' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
  { id: 'email', label: 'E-mail', icon: 'mail' },
];
