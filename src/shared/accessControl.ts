export function hasRole(roles: string[], required: string | string[]): boolean {
  const requiredRoles = Array.isArray(required) ? required : [required];
  return requiredRoles.some((r) => roles.includes(r));
}
