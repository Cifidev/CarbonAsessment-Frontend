// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    databaseUrl: 'https://getreadyforai-default-rtdb.europe-west1.firebasedatabase.app/'
  },
  urlback: 'https://greencrossback-end.onrender.com/api/user/',
  production: false,
  supabase: {
    url: 'https://gkwdofzxyijuosvgkgvq.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2RvZnp4eWlqdW9zdmdrZ3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTQwNTQsImV4cCI6MjA1OTc5MDA1NH0.fQsA1ctUA6uqvGscKX02vusOD7-Rbvau6pAXCFripM4'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
