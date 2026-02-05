import Featured from "@/components/home/Featured";

const WhyFoodhub = () => {
    return (
        <div>
             {/* WHY FOODHUB */}
      <section className="container mx-auto px-4 pb-32">
        <h2 className="text-2xl font-semibold text-center mb-12">
          Why choose FoodHub?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <Featured
           
          />

          <Featured
          />

          <Featured
          />

        </div>
      </section>

        </div>
    );
};

export default WhyFoodhub;