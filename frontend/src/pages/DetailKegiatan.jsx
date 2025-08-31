import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react"; 
import Header from "@/components/Header";
import DetailHero from "@/components/bantuDesa/detailKegiatan/DetailHero";
import DetailInformasi from "@/components/bantuDesa/detailKegiatan/DetailInformasi";
import DonasiProgress from "@/components/bantuDesa/detailKegiatan/DonasiProgress";
import InformasiKontak from "@/components/bantuDesa/detailKegiatan/InformasiKontak";
import Footer from "@/components/Footer";
import useThemeStore from "@/store/theme";
import { useDetailKegiatan } from "@/hooks/bantuDesa/useKegiatan";

const DetailKegiatanPage = () => {
  const { id } = useParams();
  const { isDarkMode } = useThemeStore();
  
  const { data: kegiatan, isLoading, error } = useDetailKegiatan(id);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
          <span className="text-lg font-medium text-gray-600">Memuat detail kegiatan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-xl text-red-600 mb-4">
            {error.response?.data?.message || "Gagal memuat detail kegiatan"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-red-600">Kegiatan tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header />
      <DetailHero title={kegiatan.judul} image={kegiatan.foto_url} />
      <DonasiProgress
        terkumpul={kegiatan.dana_terkumpul}
        target={kegiatan.target_dana}
        deadline={kegiatan.tanggal_selesai}
        jumlahDonatur={kegiatan.jumlah_donatur}
        progressPercentage={kegiatan.progress_percentage}
      />
      <DetailInformasi
        deskripsi={kegiatan.deskripsi}
        jadwal={kegiatan.jadwal ? JSON.parse(kegiatan.jadwal) : []}
        persyaratan={kegiatan.persyaratan ? JSON.parse(kegiatan.persyaratan) : {}}
        galeri={kegiatan.galeri ? JSON.parse(kegiatan.galeri) : []}
      />
      <InformasiKontak creator={kegiatan.creator} />
      <Footer />
    </div>
  );
};

export default DetailKegiatanPage;