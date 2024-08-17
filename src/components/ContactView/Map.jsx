import "../ContactView/map.css";

const Map = () => {
  return (
    <div className="map-container text-center my-4">
      <h1>Encontranos en:</h1>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d222.54137355627384!2d-65.20182443446957!3d-26.818889678195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s25%20de%20Mayo%20899!5e0!3m2!1ses!2sar!4v1723657993046!5m2!1ses!2sar"
        className="map-iframe"
        allowfullscreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
       <div className="contact-info mt-4">
        <p>Dirección: 25 de Mayo 899, San Miguel de Tucumán, Argentina</p>
        <p>Teléfono: +54 381 1234567</p>
        <p>WhatsApp: +54 9 381 7654321</p>
      </div>
    </div>
  );
};
export default Map;
