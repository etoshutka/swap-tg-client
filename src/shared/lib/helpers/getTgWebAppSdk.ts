export const getTgWebAppSdk = async () => {
  const webAppSdk = (await import('@twa-dev/sdk')).default;
  if (!webAppSdk) return;
  return webAppSdk;
};
