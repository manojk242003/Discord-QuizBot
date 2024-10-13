
import { useRecoilValue } from 'recoil'
import Navbar from '../components/Navbar'
import QuizMenu from '../components/QuizMenu'
import { loadingState } from '../atoms/Loading'

const Home = () => {
  const loading = useRecoilValue(loadingState)
  return (
    <div>
      <Navbar />
      {!loading ? (
        <div>
          <QuizMenu />
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  )
}

export default Home
