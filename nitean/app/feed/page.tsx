// export const instant = false

import FeedList from "@/components/feed/FeedList"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"

const page = () => {
  return (
    <ProtectedLayout>
      <FeedList/>
    </ProtectedLayout>
  )
}

export default page