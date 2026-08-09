function AdminHeader({ title }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        marginBottom: "25px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <h2>{title}</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: "#2e7d32",
          }}
        >
          👤 Welcome Admin
        </span>
      </div>
    </div>
  );
}

export default AdminHeader;