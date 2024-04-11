import makeId from '@/utils/id'
import useFallback from '@/hooks/useFallback'

export default <T extends string>(id: T, prefix: string) => useFallback(id, () => makeId(prefix))
