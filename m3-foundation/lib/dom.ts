type IdReferenceList = string | null | undefined

export const mergeIdRefs = (...lists: IdReferenceList[]): string | undefined => {
  const ids = lists.flatMap(list => list?.trim().split(/\s+/).filter(Boolean) ?? [])

  return ids.length > 0 ? [...new Set(ids)].join(' ') : undefined
}
