import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iezuecepdjdczzxoajwg.supabase.co';
// Note: In a production app, use process.env.SUPABASE_KEY. 
// For this demo environment, we are using the provided publishable key.
const supabaseKey = 'sb_publishable_w_2IdqyKRMl92rvFWxb12w_NfHyF7G_';

export const supabase = createClient(supabaseUrl, supabaseKey);