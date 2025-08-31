import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import DetailHero from "@/components/bantuDesa/detailKegiatan/DetailHero";
import DetailInformasi from "@/components/bantuDesa/detailKegiatan/DetailInformasi";
import DonasiProgress from "@/components/bantuDesa/detailKegiatan/DonasiProgress";
import InformasiKontak from "@/components/bantuDesa/detailKegiatan/InformasiKontak";
import Footer from "@/components/Footer";
import useThemeStore from "@/store/theme";
import { Loader2 } from "lucide-react"; 

const DetailKegiatanPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("kegiatan_desa")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setData(data);
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="ml-4 text-lg font-medium text-gray-600">Memuat kegiatan...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-red-600">Kegiatan tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header />
      <DetailHero title={data.judul} image={data.foto_url} />
      <DonasiProgress
        terkumpul={data.dana_terkumpul}
        target={data.target_dana}
        deadline={data.tanggal_selesai}
      />
      <DetailInformasi
        deskripsi={data.deskripsi}
        jadwal={data.jadwal}
        persyaratan={data.persyaratan}
        galeri={data.galeri}
      />
      <InformasiKontak />
      <Footer />
    </div>
  );
};

export default DetailKegiatanPage;
