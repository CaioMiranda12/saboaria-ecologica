const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-verde-medio/15 bg-creme px-5 py-5 md:flex-row md:px-20">
      <span className="font-serif text-base font-bold text-verde-principal">
        SABOARIA <em className="font-normal text-verde-medio not-italic">ecológica</em>
      </span>
      <span className="text-xs font-light text-verde-muted">
        © 2026 Saboaria Ecológica · Iparana, Ceará
      </span>
    </footer>
  );
};

export default Footer;
