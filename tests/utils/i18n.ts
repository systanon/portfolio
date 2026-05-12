export type NestedRecord = { [key: string]: string | NestedRecord }

export function flattenKeys(obj: NestedRecord, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    return typeof value === 'object' ? flattenKeys(value, fullKey) : [fullKey]
  })
}

export function getPlaceholders(str: string): string[] {
  return [...str.matchAll(/\{(\w+)\}/g)].map((m) => m[1])
}

export function getValueByPath(
  obj: NestedRecord,
  path: string,
): string | undefined {
  return path
    .split('.')
    .reduce<NestedRecord | string | undefined>((acc, key) => {
      if (acc && typeof acc === 'object') return acc[key]
      return undefined
    }, obj) as string | undefined
}

export function findDuplicateValues(obj: NestedRecord): string[] {
  const duplicates: string[] = []

  for (const [namespace, section] of Object.entries(obj)) {
    if (typeof section !== 'object') continue

    const seen = new Map<string, string>()

    for (const [key, value] of Object.entries(section)) {
      if (typeof value !== 'string') continue
      const existing = seen.get(value)
      if (existing) {
        duplicates.push(
          `"${value}" — ${namespace}.${existing} = ${namespace}.${key}`,
        )
      } else {
        seen.set(value, key)
      }
    }
  }

  return duplicates
}
