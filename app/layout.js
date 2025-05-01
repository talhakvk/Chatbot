import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Chatbot',
  description: 'Modern yapay zeka destekli sohbet asistanı',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" />
      </body>
    </html>
  )
}
