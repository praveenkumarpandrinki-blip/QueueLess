function ServiceCard({ service, onBook }) {
  return (
    <div className="service-card">
      <div className="service-icon">📅</div>

      <h3>{service.name}</h3>

      <p>{service.description}</p>

      <div className="service-details">
        <span>{service.duration} min</span>
        <strong>₹{service.price}</strong>
      </div>

      <button
        className="primary-btn service-button"
        onClick={() => onBook(service)}
      >
        Book Now
      </button>
    </div>
  );
}

export default ServiceCard;