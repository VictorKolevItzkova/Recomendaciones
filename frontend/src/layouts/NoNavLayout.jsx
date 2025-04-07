import { Outlet } from "react-router-dom"

const NoNavLayout = () => {
  return (
    <main>
        <Outlet/>
    </main>
  )
}

export default NoNavLayout