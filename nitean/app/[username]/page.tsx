import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import ProfilePage from '@/components/profile/profile-page'

// export const instant = false

const Page = () => {
  return (
      <ProtectedLayout hide_right_bar={true}>
        <ProfilePage />
      </ProtectedLayout>
  )
}

export default Page