import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      id: 1,
      name: "Parrot",
      image: "🦜",
      count: 20,
    },
    {
      id: 2,
      name: "Love Bird",
      image: "🐥",
      count: 20,
    },
    {
      id: 3,
      name: "Cockatiel",
      image: "🕊️",
      count: 20,
    },
    {
      id: 4,
      name: "Budgie",
      image: "🐤",
      count: 20,
    },
    {
      id: 5,
      name: "Finch",
      image: "🐦",
      count: 20,
    },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">
          Popular Categories
        </h2>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?type=${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <div className="category-image">
                {category.image}
              </div>

              <h3>{category.name}</h3>

              <p>({category.count})</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;