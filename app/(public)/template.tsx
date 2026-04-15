import { PageFade } from '@/components/motion/page-fade'

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageFade>{children}</PageFade>
}
