function AdminSidebar({ activeTab, setActiveTab }) {
  const menus = [
    "Dashboard",
    "Products",
    "Orders",
    "Customers",
    "Settings",
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#1b4332",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
        🦜 Birds Care
      </h2>

      {menus.map((menu) => (
        <div
          key={menu}
          onClick={() => setActiveTab(menu)}
          style={{
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            background:
              activeTab === menu ? "#2d6a4f" : "transparent",
          }}
        >
          {menu}
        </div>
      ))}
    </div>
  );
}

export default AdminSidebar;