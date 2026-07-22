import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Container, Loader } from 'rsuite'

function App() {
	const params = useSearchParams()
	const code = params.get('code')
	useEffect(() => {
		if (code) {
			if (window.electronAPI) {
				window.electronAPI.sendCode(code)
			} else {
				localStorage.setItem('pendingOAuthCode', code)
			}
		}
		setTimeout(() => window.close(), 3000)
	}, [code])

	return (
		<Container style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Loader size="lg" style={{ margin: '5em auto' }} />
		</Container>
	)
}
export default App
