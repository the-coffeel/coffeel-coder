import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import ProfilePage from '@/components/profile/profile-page'

// export const instant = false

const Page = () => {
  return (
      <ProtectedLayout>
        <ProfilePage />
      </ProtectedLayout>
  )
}

export default Page