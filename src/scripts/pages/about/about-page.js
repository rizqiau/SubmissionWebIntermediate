export default class AboutPage {
  async render() {
    return `
      <section class="container about-section">
        <h1 class="about-title">Tentang Aplikasi Story App</h1>
        <div class="about-content">
          <p>
            Aplikasi Story App adalah platform inovatif yang memungkinkan pengguna
            untuk berbagi cerita dan momen melalui foto dan deskripsi singkat.
            Dibuat dengan semangat berbagi, aplikasi ini dirancang untuk
            mempermudah Anda dalam mengabadikan pengalaman sehari-hari dan
            melihat cerita dari orang lain di seluruh dunia.
          </p>
          <p>
            Dengan fitur tambah story yang intuitif, Anda dapat mengunggah foto,
            menambahkan deskripsi yang menarik, dan bahkan menandai lokasi cerita
            Anda di peta. Jelajahi berbagai cerita yang dibagikan oleh komunitas
            dan temukan inspirasi dari perspektif yang berbeda.
          </p>
          <p>
            Proyek ini dikembangkan sebagai bagian dari pembelajaran di Dicoding Academy,
            dengan fokus pada penerapan arsitektur Model-View-Presenter (MVP)
            dan standar pengembangan web modern, termasuk aksesibilitas dan performa.
          </p>
          <p>
            Kami percaya bahwa setiap orang memiliki cerita unik untuk diceritakan,
            dan Story App hadir untuk menjadi wadah bagi cerita-cerita tersebut.
            Terima kasih telah bergabung dengan komunitas kami!
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {}
}
