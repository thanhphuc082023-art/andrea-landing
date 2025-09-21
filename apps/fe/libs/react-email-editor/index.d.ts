import { Component } from 'react';

export interface EmailEditorProps {
  /**
   * The initial data for the editor
   */
  data?: any;

  /**
   * Callback function called when the editor is ready
   */
  onReady?: () => void;

  /**
   * Callback function called when the editor data changes
   */
  onChange?: (data: any) => void;

  /**
   * Callback function called when the editor loads
   */
  onLoad?: () => void;

  /**
   * Additional options for the editor
   */
  options?: {
    [key: string]: any;
  };

  /**
   * Custom CSS classes
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;

  /**
   * Editor appearance settings
   */
  appearance?: {
    theme?: string;
    panels?: {
      tools?: {
        dock?: string;
      };
    };
  };

  /**
   * Project ID for the editor
   */
  projectId?: number;

  /**
   * Tools configuration
   */
  tools?: {
    [key: string]: any;
  };

  /**
   * Blocks configuration
   */
  blocks?: any[];

  /**
   * Editor locale
   */
  locale?: string;

  /**
   * Custom CSS variables
   */
  css?: string;

  /**
   * Min height of the editor
   */
  minHeight?: string | number;

  /**
   * Editor ID
   */
  id?: string;

  /**
   * Disable editor
   */
  disabled?: boolean;

  /**
   * Editor mode
   */
  mode?: 'edit' | 'preview';

  /**
   * Custom merge tags
   */
  mergeTags?: any[];

  /**
   * Custom design tags
   */
  designTags?: any[];

  /**
   * Custom special links
   */
  specialLinks?: any[];

  /**
   * Custom translations
   */
  translations?: {
    [key: string]: any;
  };

  /**
   * Custom fonts
   */
  fonts?: any[];

  /**
   * Custom colors
   */
  colors?: any[];

  /**
   * Custom text direction
   */
  textDirection?: 'ltr' | 'rtl';

  /**
   * Custom user
   */
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };

  /**
   * Custom tags
   */
  tags?: any[];

  /**
   * Custom editor appearance
   */
  editor?: {
    minRows?: number;
    maxRows?: number;
  };

  /**
   * Custom features
   */
  features?: {
    [key: string]: boolean;
  };

  /**
   * Custom variables
   */
  variables?: any[];

  /**
   * Custom merge tags configuration
   */
  mergeTagsConfig?: {
    [key: string]: any;
  };

  /**
   * Custom design tags configuration
   */
  designTagsConfig?: {
    [key: string]: any;
  };

  /**
   * Custom special links configuration
   */
  specialLinksConfig?: {
    [key: string]: any;
  };

  /**
   * Custom translations configuration
   */
  translationsConfig?: {
    [key: string]: any;
  };

  /**
   * Custom fonts configuration
   */
  fontsConfig?: {
    [key: string]: any;
  };

  /**
   * Custom colors configuration
   */
  colorsConfig?: {
    [key: string]: any;
  };

  /**
   * Custom text direction configuration
   */
  textDirectionConfig?: {
    [key: string]: any;
  };

  /**
   * Custom user configuration
   */
  userConfig?: {
    [key: string]: any;
  };

  /**
   * Custom tags configuration
   */
  tagsConfig?: {
    [key: string]: any;
  };

  /**
   * Custom editor configuration
   */
  editorConfig?: {
    [key: string]: any;
  };

  /**
   * Custom features configuration
   */
  featuresConfig?: {
    [key: string]: any;
  };

  /**
   * Custom variables configuration
   */
  variablesConfig?: {
    [key: string]: any;
  };
}

export interface EmailEditorRef {
  /**
   * Save the editor data
   */
  saveDesign: (callback: (data: any) => void) => void;

  /**
   * Load data into the editor
   */
  loadDesign: (data: any) => void;

  /**
   * Export the editor data as HTML
   */
  exportHtml: (callback: (data: any) => void) => void;

  /**
   * Register a callback for editor events
   */
  addEventListener: (event: string, callback: (data: any) => void) => void;

  /**
   * Remove a callback for editor events
   */
  removeEventListener: (event: string, callback: (data: any) => void) => void;

  /**
   * Get the editor data
   */
  getDesign: (callback: (data: any) => void) => void;

  /**
   * Set the editor data
   */
  setDesign: (data: any) => void;

  /**
   * Clear the editor
   */
  clear: () => void;

  /**
   * Undo the last action
   */
  undo: () => void;

  /**
   * Redo the last undone action
   */
  redo: () => void;

  /**
   * Toggle preview mode
   */
  togglePreview: () => void;

  /**
   * Set the editor mode
   */
  setMode: (mode: 'edit' | 'preview') => void;

  /**
   * Get the editor mode
   */
  getMode: () => 'edit' | 'preview';

  /**
   * Set the editor appearance
   */
  setAppearance: (appearance: any) => void;

  /**
   * Get the editor appearance
   */
  getAppearance: () => any;

  /**
   * Set the editor options
   */
  setOptions: (options: any) => void;

  /**
   * Get the editor options
   */
  getOptions: () => any;

  /**
   * Set the editor tools
   */
  setTools: (tools: any) => void;

  /**
   * Get the editor tools
   */
  getTools: () => any;

  /**
   * Set the editor blocks
   */
  setBlocks: (blocks: any[]) => void;

  /**
   * Get the editor blocks
   */
  getBlocks: () => any[];

  /**
   * Set the editor locale
   */
  setLocale: (locale: string) => void;

  /**
   * Get the editor locale
   */
  getLocale: () => string;

  /**
   * Set the editor CSS
   */
  setCss: (css: string) => void;

  /**
   * Get the editor CSS
   */
  getCss: () => string;

  /**
   * Set the editor min height
   */
  setMinHeight: (minHeight: string | number) => void;

  /**
   * Get the editor min height
   */
  getMinHeight: () => string | number;

  /**
   * Set the editor ID
   */
  setId: (id: string) => void;

  /**
   * Get the editor ID
   */
  getId: () => string;

  /**
   * Set the editor disabled state
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Get the editor disabled state
   */
  getDisabled: () => boolean;

  /**
   * Set the editor merge tags
   */
  setMergeTags: (mergeTags: any[]) => void;

  /**
   * Get the editor merge tags
   */
  getMergeTags: () => any[];

  /**
   * Set the editor design tags
   */
  setDesignTags: (designTags: any[]) => void;

  /**
   * Get the editor design tags
   */
  getDesignTags: () => any[];

  /**
   * Set the editor special links
   */
  setSpecialLinks: (specialLinks: any[]) => void;

  /**
   * Get the editor special links
   */
  getSpecialLinks: () => any[];

  /**
   * Set the editor translations
   */
  setTranslations: (translations: any) => void;

  /**
   * Get the editor translations
   */
  getTranslations: () => any;

  /**
   * Set the editor fonts
   */
  setFonts: (fonts: any[]) => void;

  /**
   * Get the editor fonts
   */
  getFonts: () => any[];

  /**
   * Set the editor colors
   */
  setColors: (colors: any[]) => void;

  /**
   * Get the editor colors
   */
  getColors: () => any[];

  /**
   * Set the editor text direction
   */
  setTextDirection: (textDirection: 'ltr' | 'rtl') => void;

  /**
   * Get the editor text direction
   */
  getTextDirection: () => 'ltr' | 'rtl';

  /**
   * Set the editor user
   */
  setUser: (user: any) => void;

  /**
   * Get the editor user
   */
  getUser: () => any;

  /**
   * Set the editor tags
   */
  setTags: (tags: any[]) => void;

  /**
   * Get the editor tags
   */
  getTags: () => any[];

  /**
   * Set the editor editor configuration
   */
  setEditor: (editor: any) => void;

  /**
   * Get the editor editor configuration
   */
  getEditor: () => any;

  /**
   * Set the editor features
   */
  setFeatures: (features: any) => void;

  /**
   * Get the editor features
   */
  getFeatures: () => any;

  /**
   * Set the editor variables
   */
  setVariables: (variables: any[]) => void;

  /**
   * Get the editor variables
   */
  getVariables: () => any[];
}

declare class EmailEditor extends Component<EmailEditorProps> {
  /**
   * Reference to the editor instance
   */
  editor: EmailEditorRef;
}

export default EmailEditor;
