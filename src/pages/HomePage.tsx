import { useLayoutEffect, useRef } from "react"

import { useAnimationPreference } from "@/components/animation-provider"
import { HomeFpvExperience } from "@/components/HomeFpvExperience"
import { HomePlainExperience } from "@/components/HomePlainExperience"
import { Layout } from "@/components/Layout"

export function HomePage() {
  const { animationMode, isPlainDisplayMode } = useAnimationPreference()
  const previousAnimationModeRef = useRef(animationMode)

  useLayoutEffect(() => {
    const previousAnimationMode = previousAnimationModeRef.current

    if (previousAnimationMode === "plain" && animationMode !== "plain") {
      window.scrollTo(0, 0)
    }

    previousAnimationModeRef.current = animationMode
  }, [animationMode])

  if (isPlainDisplayMode) {
    return (
      <Layout mainClassName="plain-home-main">
        <HomePlainExperience />
      </Layout>
    )
  }

  return (
    <Layout mainClassName="!px-0 !pt-0 !pb-0 sm:!px-0 md:!px-0 lg:!px-0 xl:!px-0 2xl:!px-0 min-[1800px]:!px-0">
      <HomeFpvExperience />
    </Layout>
  )
}
