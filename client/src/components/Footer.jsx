// Simple site footer shown on every page.
function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <p>&copy; {year} Michael Johnson &mdash; Portfolio (fictional/placeholder profile for coursework).</p>
    </footer>
  )
}

export default Footer
