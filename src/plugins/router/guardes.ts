import type { Application } from '@/application/application'
import type { NavigationGuard, RouteLocationNormalized } from 'vue-router'

export const canUserAccess = async (
  to: RouteLocationNormalized,
  isAuthenticated: boolean,
) => {
  const { accessMode = "public" } = to.meta;

  if (accessMode === "only-for-unauthorized" && !isAuthenticated) {
    return true;
  }
  if (accessMode === "only-for-unauthorized" && isAuthenticated) {
    return false;
  }
  if (accessMode === "private" && !isAuthenticated) {
    return false;
  }
  if (accessMode === "private" && isAuthenticated) {
    return true;
  }

  return false;
};

export const navigationGuard = (application: Application): NavigationGuard => async (to, from) => {
  const { accessMode = "public" } = to.meta;
  if (from.fullPath === to.fullPath && from.name === to.name) return false;

  if (accessMode === "public") return true;

  await application.profileLoading

  const canAccess = await canUserAccess(
    to,
    application.isLodged,
  );
  if (!canAccess) {
    const canAccess = await canUserAccess(
      from,
      application.isLodged,
    );
    if (!canAccess) {

      return { name: "Home" };
    }

    return false;
  }

  return true;
}
