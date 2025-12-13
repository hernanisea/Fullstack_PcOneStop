import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          
          {/* Encabezado */}
          <h1 className="display-5 fw-bold text-center mb-4">
            Tu Parada Única para el PC Perfecto
          </h1>
          <p className="lead text-center text-muted mb-5">
            Bienvenidos a PC OneStop, el lugar donde la pasión por la tecnología y el rendimiento se encuentran.
          </p>

          {/* Sección 1: Misión */}
          <div className="mb-5">
            <h2 className="fw-bold mb-3">Nuestra Misión</h2>
            <p className="fs-5">
              Nacimos de una idea simple: construir un PC no debería ser complicado. En un mundo lleno de componentes y opciones, queríamos crear un espacio centralizado donde tanto entusiastas experimentados como nuevos constructores pudieran encontrar exactamente lo que necesitan, sin complicaciones.
            </p>
            <p className="fs-5">
              Somos un equipo de apasionados por el hardware dedicados a seleccionar el mejor catálogo de componentes del mercado. Desde procesadores (CPU) y tarjetas gráficas (GPU) de última generación, hasta esa memoria RAM, SSD o gabinete perfecto que completa tu <em>setup</em>.
            </p>
          </div>

          {/* Sección 2: Diferencia */}
          <div className="mb-5">
            <h2 className="fw-bold mb-3">¿Qué nos hace diferentes?</h2>
            <p className="fs-5">
              En PC OneStop, no solo vendemos piezas; te ayudamos a construir sueños.
            </p>
            <p className="fs-5">
              Nuestra herramienta estrella, el <strong>Armador de PC (PC Builder)</strong>, está diseñada para guiarte en cada paso del proceso. Valida la compatibilidad entre componentes por ti, asegurando que cada pieza funcione en perfecta armonía. Ya sea que estés armando un equipo <em>gamer</em> de élite o una estación de trabajo de alta eficiencia, estamos aquí para que lo logres con confianza.
            </p>
          </div>

          {/* Sección 3: Compromiso y CTA */}
          <div className="card shadow-sm p-4 text-center">
            <div className="card-body">
              <h3 className="fw-bold mb-3">Nuestro Compromiso</h3>
              <p className="fs-5 text-muted">
                Creemos en la transparencia, en precios justos y en un catálogo que siempre está creciendo. Desde nuestras ofertas especiales hasta el último lanzamiento, nuestro objetivo es ser tu aliado de confianza y tu "parada única" (OneStop) para todo lo relacionado con el mundo del PC.
              </p>
              <hr className="my-4" />
              <p className="fs-5 fw-bold">
                ¡Gracias por elegirnos!
              </p>
              
              {/* Call to Action (Llamada a la acción) */}
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link to="/build" className="btn btn-primary btn-lg px-4">
                  Armar mi PC
                </Link>
                <Link to="/products" className="btn btn-outline-light btn-lg px-4">
                  Ver Catálogo
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};