export const metadata = {
  title: 'Points',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', backgroundColor: '#f0f0f0' }}>
        {children}
      </body>
    </html>
  )
}