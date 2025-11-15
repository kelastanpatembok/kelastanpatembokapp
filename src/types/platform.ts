export interface PlatformBranding {
  logoUrl?: string;
  primaryColor?: string;
}

export interface PlatformSettings {
  features: {
    communities?: boolean;
    courses?: boolean;
    successStories?: boolean;
  };
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  branding: PlatformBranding;
  settings: PlatformSettings;
  ownerId: string;
  public: boolean;
  createdAt?: any;
  updatedAt?: any;
}

