export interface Environment {
  firebase: {
    databaseUrl: string;
  };
  urlback: string;
  production: boolean;
  supabase: {
    url: string;
    key: string;
  };
} 