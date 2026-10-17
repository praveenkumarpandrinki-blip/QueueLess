function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            Queue<span>Less</span>
          </div>

          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthCard;