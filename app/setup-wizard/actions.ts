'use server';

import { updateStoreSettings } from '@/lib/db';

export async function saveWizardSettings(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const storeName = formData.get('storeName') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const socialLinksJson = formData.get('socialLinks') as string;

    let socialLinks = {};
    if (socialLinksJson) {
      try {
        socialLinks = JSON.parse(socialLinksJson);
      } catch {
        socialLinks = {};
      }
    }

    await updateStoreSettings({
      store_name: storeName,
      primary_color: primaryColor,
      social_links: socialLinks,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to save wizard settings:', {
      message: error.message,
      detail: error.detail,
      code: error.code,
      hint: error.hint,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
}
