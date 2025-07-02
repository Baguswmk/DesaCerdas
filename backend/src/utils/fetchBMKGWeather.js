import axios from "axios";

const LOCATION_LABELS = {
  "18.10.01.1001": "Kelurahan Fajaresuk",
  "18.10.01.1002": "Kelurahan Pringsewu Utara",
  "18.10.01.1003": "Kelurahan Pringsewu Selatan",
  "18.10.01.1004": "Kelurahan Pringsewu Barat",
  "18.10.01.1005": "Kelurahan Pringsewu Timur",
  "18.10.01.2006": "Pekon Margakaya",
  "18.10.01.2007": "Pekon Waluyojati",
  "18.10.01.2008": "Pekon Sidoharjo",
  "18.10.01.2009": "Pekon Podomoro",
  "18.10.01.2010": "Pekon Bumi Arum",
  "18.10.01.2011": "Pekon Fajar Agung",
  "18.10.01.2012": "Pekon Rejo Sari",
  "18.10.01.2013": "Pekon Bumi Ayu",
  "18.10.01.2014": "Pekon Podosari",
  "18.10.01.2015": "Pekon Fajar Agung Barat",

  "18.10.02.2001": "Pekon Parerejo",
  "18.10.02.2002": "Pekon Blitarejo",
  "18.10.02.2003": "Pekon Panjerejo",
  "18.10.02.2004": "Pekon Bulokarto",
  "18.10.02.2005": "Pekon Wates",
  "18.10.02.2006": "Pekon Tambahrejo",
  "18.10.02.2007": "Pekon Wonodadi",
  "18.10.02.2008": "Pekon Gadingrejo",
  "18.10.02.2009": "Pekon Tegalsari",
  "18.10.02.2010": "Pekon Tulung Agung",
  "18.10.02.2011": "Pekon Bulurejo",
  "18.10.02.2012": "Pekon Yogyakarta",
  "18.10.02.2013": "Pekon Kediri",
  "18.10.02.2014": "Pekon Mataram",
  "18.10.02.2015": "Pekon Wonosari",
  "18.10.02.2016": "Pekon Klaten",
  "18.10.02.2017": "Pekon Wates Timur",
  "18.10.02.2018": "Pekon Wates Selatan",
  "18.10.02.2019": "Pekon Gading Rejo Timur",
  "18.10.02.2020": "Pekon Gading Rejo Utara",
  "18.10.02.2021": "Pekon Tambah Rejo Barat",
  "18.10.02.2022": "Pekon Wonodadi Utara",
  "18.10.02.2023": "Pekon Yogyakarta Selatan",

  "18.10.03.2001": "Pekon Ambarawa",
  "18.10.03.2002": "Pekon Ambarawa Barat",
  "18.10.03.2003": "Pekon Kresno Mulyo",
  "18.10.03.2004": "Pekon Sumber Agung",
  "18.10.03.2005": "Pekon Tanjung Anom",
  "18.10.03.2006": "Pekon Jati Agung",
  "18.10.03.2007": "Pekon Margodadi",
  "18.10.03.2008": "Pekon Ambarawa Timur",

  "18.10.04.2001": "Pekon Kedaung",
  "18.10.04.2002": "Pekon Pardasuka",
  "18.10.04.2003": "Pekon Suka Negeri",
  "18.10.04.2004": "Pekon Tanjung Rusia",
  "18.10.04.2005": "Pekon Warga Mulyo",
  "18.10.04.2006": "Pekon Pujodadi",
  "18.10.04.2007": "Pekon Sukorejo",
  "18.10.04.2008": "Pekon Selapan",
  "18.10.04.2009": "Pekon Rantau Tijang",
  "18.10.04.2010": "Pekon Sidodadi",
  "18.10.04.2011": "Pekon Pardasuka Timur",
  "18.10.04.2012": "Pekon Tanjung Rusia Timur",
  "18.10.04.2013": "Pekon Pardasuka Selatan",

  "18.10.05.2001": "Pekon Candi Retno",
  "18.10.05.2002": "Pekon Tanjung Dalom",
  "18.10.05.2003": "Pekon Way Ngison",
  "18.10.05.2004": "Pekon Suka Wangi",
  "18.10.05.2005": "Pekon Suka Ratu",
  "18.10.05.2006": "Pekon Pagelaran",
  "18.10.05.2007": "Pekon Patoman",
  "18.10.05.2008": "Pekon Karangsari",
  "18.10.05.2009": "Pekon Gumuk Mas",
  "18.10.05.2010": "Pekon Bumi Ratu",
  "18.10.05.2011": "Pekon Panutan",
  "18.10.05.2012": "Pekon Lugusari",
  "18.10.05.2019": "Pekon Pamenang",
  "18.10.05.2020": "Pekon Gemah Ripah",
  "18.10.05.2023": "Pekon Pasir Ukir",
  "18.10.05.2024": "Pekon Gumukrejo",
  "18.10.05.2027": "Pekon Puji Harjo",
  "18.10.05.2028": "Pekon Padang Rejo",
  "18.10.05.2029": "Pekon Sidodadi",
  "18.10.05.2030": "Pekon Sumber Rejo",
  "18.10.05.2031": "Pekon Ganjaran",
  "18.10.05.2032": "Pekon Bumi Rejo",

  "18.10.06.2001": "Pekon Banyumas",
  "18.10.06.2002": "Pekon Banyuwangi",
  "18.10.06.2003": "Pekon Sukamulya",
  "18.10.06.2004": "Pekon Sriwungu",
  "18.10.06.2005": "Pekon Banjarejo",
  "18.10.06.2006": "Pekon Waya Krui",
  "18.10.06.2007": "Pekon Sri Rahayu",
  "18.10.06.2008": "Pekon Nusa Wungu",
  "18.10.06.2009": "Pekon Sinar Mulya",
  "18.10.06.2010": "Pekon Banyu Urip",
  "18.10.06.2011": "Pekon Mulyo Rejo",

  "18.10.07.2001": "Pekon Adiluwih",
  "18.10.07.2002": "Pekon Bandung Baru",
  "18.10.07.2003": "Pekon Sinarwayah",
  "18.10.07.2004": "Pekon Enggal Rejo",
  "18.10.07.2005": "Pekon Sukoharum",
  "18.10.07.2006": "Pekon Waringin Sari Timur",
  "18.10.07.2007": "Pekon Tri Tunggal Mulya",
  "18.10.07.2008": "Pekon Purwodadi",
  "18.10.07.2009": "Pekon Srikaton",
  "18.10.07.2010": "Pekon Tunggul Pawenang",
  "18.10.07.2011": "Pekon Bandung Baru Barat",
  "18.10.07.2012": "Pekon Totokarto",
  "18.10.07.2013": "Pekon Kuta Waringin",

  "18.10.08.2001": "Pekon Sinar Baru",
  "18.10.08.2002": "Pekon Sukoharjo I",
  "18.10.08.2003": "Pekon Sukoharjo II",
  "18.10.08.2004": "Pekon Sukoharjo III",
  "18.10.08.2005": "Pekon Sukoharjo IV",
  "18.10.08.2006": "Pekon Panggungrejo",
  "18.10.08.2007": "Pekon Pandan Sari",
  "18.10.08.2008": "Pekon Pandan Surat",
  "18.10.08.2009": "Pekon Keputran",
  "18.10.08.2010": "Pekon Sukoyoso",
  "18.10.08.2011": "Pekon Siliwangi",
  "18.10.08.2012": "Pekon Waringinsari Barat",
  "18.10.08.2013": "Pekon Pandan Sari Selatan",
  "18.10.08.2014": "Pekon Sinar Baru Timur",
  "18.10.08.2015": "Pekon Panggung Rejo Utara",
  "18.10.08.2016": "Pekon Sukoharjo III Barat",

  "18.10.09.2001": "Pekon Fajar Baru",
  "18.10.09.2002": "Pekon Kemilin",
  "18.10.09.2003": "Pekon Neglasari",
  "18.10.09.2004": "Pekon Fajar Mulia",
  "18.10.09.2005": "Pekon Margosari",
  "18.10.09.2006": "Pekon Giri Tunggal",
  "18.10.09.2007": "Pekon Sumber Bandung",
  "18.10.09.2008": "Pekon Madaraya",
  "18.10.09.2009": "Pekon Way Kunir",
  "18.10.09.2010": "Pekon Gunung Raya"
};
/**
 * Ambil & format data cuaca dari BMKG.
 * @param {string} regionCode - kode wilayah tingkat IV (adm4), contoh: '18.10.01.1004'
 * @returns {Promise<Array>} - daftar data cuaca format sesuai schema Prisma
 */
export const fetchBMKGWeather = async (regionCode) => {
  try {
    const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${regionCode}`;
    const { data } = await axios.get(url);

    const cuacaArray = data?.data?.[0]?.cuaca || [];
    const desa = data?.lokasi?.desa || regionCode;
    const adm3 = data?.lokasi?.adm3;
    const kecamatan = LOCATION_LABELS[adm3] || data?.lokasi?.kecamatan || adm3;

    const formatted = cuacaArray.flatMap((daily) =>
      daily.map((item) => ({
        location: `${desa}, ${kecamatan}`,
        date: new Date(item.local_datetime),
        forecast: item.weather_desc,
        temperature: Math.round(item.t),
        humidity: Math.round(item.hu),
        windSpeed: Math.round(item.ws),
      }))
    );
    return formatted;
  } catch (err) {
    console.error("❌ Gagal fetch BMKG:", err.message);
    return [];
  }
};
