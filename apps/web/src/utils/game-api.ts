export function getBackendURL(): string {
  const publicUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER;
  return publicUrl as string;
}
