import { Environment } from './environment.interface';

export const environment: Environment = {
  firebase: {
    databaseUrl: 'https://getreadyforai-default-rtdb.europe-west1.firebasedatabase.app/'
  },
  urlback: 'https://greencrossback-end.onrender.com/api/user/',
  production: true,
  supabase: {
    url: 'https://gkwdofzxyijuosvgkgvq.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2RvZnp4eWlqdW9zdmdrZ3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTQwNTQsImV4cCI6MjA1OTc5MDA1NH0.fQsA1ctUA6uqvGscKX02vusOD7-Rbvau6pAXCFripM4'
  }
};
