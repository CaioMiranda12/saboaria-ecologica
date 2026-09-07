const Footer = () => {
  return (
    <footer className="px-5 md:px-20 py-5 flex flex-col md:flex-row justify-between items-center gap-2 border-t border-verde-medio/15 bg-creme">
      <span className="font-serif text-base font-bold text-verde-principal">
        SABOARIA <em className="font-normal not-italic text-verde-medio">ecológica</em>
      </span>
      <span className="text-xs text-verde-muted font-light">© 2026 Saboaria Ecológica · Iparana, Ceará</span>
    </footer>
  )
}

export default Footer