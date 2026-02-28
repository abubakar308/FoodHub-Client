import { FaTruck, FaLeaf, FaStar } from "react-icons/fa";

const WhyFoodhub = () => {
  const features = [
    {
      icon: <FaTruck className="text-white text-3xl" />,
      title: "Fast Delivery",
      description:
        "Get your meals delivered hot and fresh in record time, right to your doorstep.",
      bgColor: "bg-green-500",
    },
    {
      icon: <FaLeaf className="text-white text-3xl" />,
      title: "Fresh Ingredients",
      description:
        "All meals are made from high-quality, fresh ingredients for the perfect taste.",
      bgColor: "bg-yellow-500",
    },
    {
      icon: <FaStar className="text-white text-3xl" />,
      title: "Trusted Providers",
      description:
        "We partner with verified restaurants and chefs to ensure top-notch quality.",
      bgColor: "bg-red-500",
    },
  ];

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
        Why Choose FoodHub?
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${feature.bgColor}`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyFoodhub;