import heroImg from "../assets/hero.png";


function Hero() {


  return (


    <section className="hero">



      <div className="hero-content">



        <h1>

          Healthy Birds,

          <br />

          Happy Life!

        </h1>




        <p>

          Explore a wide range of healthy birds,
          premium food, accessories and expert care tips.

        </p>




        <button className="hero-btn">

          🛒 Shop Now

        </button>




      </div>






      <div className="hero-image-box">



        <img

          src={heroImg}

          alt="Healthy Bird"

          className="hero-image"

        />



      </div>





    </section>


  );


}


export default Hero;