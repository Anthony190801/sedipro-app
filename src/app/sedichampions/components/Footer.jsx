'use client'

export default function Footer({ timeout, isArticleVisible }) {
  return (
    <footer
      id="footer"
      className={`
        w-full max-w-full mt-8 text-center
        transition-all duration-[0.325s] ease-in-out
        ${isArticleVisible ? 'opacity-0 scale-95 blur-[0.1rem]' : ''}
        ${timeout ? 'opacity-0' : ''}
      `}
    >
      <p className="tracking-[0.1rem] text-xs opacity-75 mb-1 text-white">
        &copy; 2026 <a href="https://sediprount.org" className=" text-white no-underline transition-all duration-200">SEDIPRO UNT.</a> 
        {' '}Todos los derechos reservados.
      </p>

    </footer>
  )
}