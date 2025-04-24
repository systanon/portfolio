export function errorMsg(error: unknown): string {
  return (
    (error as { data?: { msg?: string } })?.data?.msg ||
    (error as { message?: string })?.message ||
    'Unknown error'
  );
}