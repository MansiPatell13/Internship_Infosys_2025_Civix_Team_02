import React from "react";
import img from "/issues.jpg";

const Mid2 = () => {
  const issueCategories = [
    "Agriculture And Food",
    "Animals And Wildlife",
    "Art, Culture And History",
    "Business And Consumers",
    "Communication",
    "Civil Liberties And Rights",
    "Criminal Law & Justice",
    "Cyber Security",
    "Defence",
    "Education",
    "Power & Energy",
    "Environment",
    "Family And Children",
    "Foreign Affairs",
    "Women Empowerment",
    "Health And Health Care",
    "Higher Education",
    "Infrastructure",
    "Labour And Employment",
    "Rural Development",
    "National Security",
    "Police Brutality",
    "Religious Freedom",
    "Role Of Government",
    "Senior Citizens",
    "Finance & Taxes",
    "Science & Technology",
    "Social Development",
    "Poverty",
    "Transportation",
    "Veterans",
    "Wealth Inequality",
    "Travel & Tourism",
    "Youth & Sports",
    "Water",
    "Corruption",
    "Information And Broadcasting",
    "Economy",
    "Housing & Property",
    "Immigration",
    "Lgbt Rights",
    "Reservation",
    "Make In India",
  ];
  return (
    <section className="py-5">
      <div className="container">
        <div className="row text-center justify-content-center">
          {/* left */}
          <div className="col-md-6">
            <img
              src={img}
              alt="img"
              className="img-fluid rounded"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>

          {/* right */}
          <div className="col-md-6">
            <div className="d-flex flex-wrap gap-2 mb-4 mt-4">
              {issueCategories.map((category, index) => (
                <button
                  key={index}
                  className="btn btn-outline-secondary btn-sm px-3"
                  style={{
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                    backgroundColor: "white",
                    border: "1px solid #dee2e6",
                    color: "#6c757d",
                    borderColor: "black",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mid2;