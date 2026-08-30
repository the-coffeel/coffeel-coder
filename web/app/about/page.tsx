import AboutPage from "@/components/about/about-page"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"

// export const instant = false

const page = () => {
  return (
      <ProtectedLayout>
        <AboutPage />
      </ProtectedLayout>
  )
}

export default page;