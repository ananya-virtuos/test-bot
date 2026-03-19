// Store configuration fetched from API based on shop ID
export interface ShopConfig {
  shopId: string;
  assistantName: string;
  brandColor: string;
  position: 'bottom-right' | 'bottom-left';
  welcomeMessage: string;
  triggerButtonText: string;
  triggerButtonEmoji?: string;
  logoUrl?: string;
  accentColor?: string;
  textColor?: string;
  borderRadius?: number;
}

export const DEFAULT_CONFIG: ShopConfig = {
  shopId: 'default',
  assistantName: 'GiftCart Assistant',
  brandColor: '#667eea',
  position: 'bottom-right',
  welcomeMessage: '👋 Hello! I\'m your GiftCart assistant. How can I help you find the perfect gift today?',
  triggerButtonText: '💬 Chat',
  triggerButtonEmoji: '💬',
  textColor: '#1f2937',
  accentColor: '#667eea',
  borderRadius: 8,
};

/**
 * Fetch shop configuration from API
 * The shop ID can be passed via:
 * 1. Query parameter: ?shopId=acme-store
 * 2. Window property set by parent iframe
 * 3. Shopify's native shop variable
 */

export async function fetchShopConfig(shopId: string): Promise<ShopConfig> {
  try {
    const response = await fetch(
      `https://largely-spirits-earned-chat.trycloudflare.com/api/v1/shop-config?shopId=${shopId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch config for shop ${shopId}, using defaults`);
      return DEFAULT_CONFIG;
    }

    const data = await response.json();
    return {
      ...DEFAULT_CONFIG,
      ...data, // Merge with defaults, API values override
    };
  } catch (error) {
    console.warn('Error fetching shop config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Get shop ID from various sources
 */
export function getShopId(): string {
  // Try query parameter first
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const queryShopId = params.get('shopId');
    if (queryShopId) return queryShopId;

    // Try window property set by parent
    if ((window as any).shopId) return (window as any).shopId;

    // Try Shopify's native variable
    if ((window as any).Shopify?.shop) {
      return (window as any).Shopify.shop;
    }
  }

  return 'default';
}

/**
 * Convert config colors to CSS variables
 */
export function generateCSSVariables(config: ShopConfig): string {
  return `
    --chatbot-brand-color: ${config.brandColor};
    --chatbot-accent-color: ${config.accentColor || config.brandColor};
    --chatbot-text-color: ${config.textColor || '#1f2937'};
    --chatbot-border-radius: ${config.borderRadius}px;
  `;
}
