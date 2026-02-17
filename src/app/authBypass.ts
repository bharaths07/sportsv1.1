export const isNonProd = (env: any) => !env?.PROD;

export const isBypassRequested = (env: any) =>
  env?.VITE_AUTH_BYPASS === 'true' || (typeof localStorage !== 'undefined' && localStorage.getItem('scoreheroes_dev_auth_bypass') === 'true');

export const shouldBypassAuth = (env: any) => isNonProd(env) && isBypassRequested(env);
