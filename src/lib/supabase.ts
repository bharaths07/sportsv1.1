import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'https://your-project.supabase.co';

// Mock Supabase Client for Development/Demo
const createMockClient = () => {
  console.warn('⚠️ Supabase is in MOCK mode. No actual network requests will be made.');
  
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    contains: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };

  return {
    from: (table: string) => {
      console.log(`[MockSupabase] Querying table: ${table}`);
      return mockQueryBuilder;
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: { id: 'mock-user' }, session: {} }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://via.placeholder.com/150' } }),
      }),
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
  };
};

// Export either the real client or the mock client
export const supabase = isPlaceholder 
  ? createMockClient() as any 
  : createClient(supabaseUrl!, supabaseKey!);
