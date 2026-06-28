import { HomeFpvExperience } from "@/components/HomeFpvExperience"
import { Layout } from "@/components/Layout"

export function HomePage() {
  return (
    <Layout mainClassName="!px-0 !pt-0 !pb-0 sm:!px-0 md:!px-0 lg:!px-0 xl:!px-0 2xl:!px-0 min-[1800px]:!px-0">
      <HomeFpvExperience />
    </Layout>
  )
}
