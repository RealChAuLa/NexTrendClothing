import "./Footer.css";

function Footer() {
  return (
    <div className="footer_SECTION">

      <div class="footer_content">

        <div class="footer_social_links">
          <div class="socail_circle">
            <i class="fa-brands fa-facebook"></i>
          </div>
          <div class="socail_circle">
            <i class="fa-brands fa-instagram"></i>
          </div>
          <div class="socail_circle">
            <i class="fa-brands fa-whatsapp"></i>
          </div>
          <div class="socail_circle">
            <i class="fa-brands fa-twitter"></i>
          </div>

        </div>
        <div class="footer_abouth">
            
          <h3>NexTrend</h3>
          <h5>
            At <b>NexTrend</b>, we believe that fashion is not just about
            clothing; it's a statement of who you are. Explore our curated
            collection of stylish, high-quality apparel designed to make you
            look and feel your best. From trendy outfits to timeless classics,
            we offer a diverse range of clothing that caters to every occasion
            and personal style.
          </h5>

        </div>
        <div class="footer_contact">

          <h3>CONTACT</h3>
          <div class="contact_service">
            <i class="fa-solid fa-envelope"></i>
            <a href="mailto:example@example.com">Support@NexTrend.lk</a>
          </div>

        </div>

      </div>
      <h5 className="copywritebarr">
        Copyright © 2024,NexTrend.designed & develop by : @sasith18,
        @RealChaula ON IG:
      </h5>
      
    </div>
  );
}

export default Footer;
