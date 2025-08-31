import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InformasiKontak = ({ creator }) => {
  const handleWhatsAppContact = () => {
    if (creator?.phone) {
      const phone = creator.phone.replace(/^0/, '62'); // Ganti 0 dengan 62
      const message = encodeURIComponent("Halo, saya ingin bertanya tentang kegiatan yang sedang berlangsung.");
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    } else {
      alert("Nomor WhatsApp tidak tersedia");
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Penanggung Jawab
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-user mr-3 text-blue-600"></i>
                    <span className="text-gray-700">
                      {creator?.name || "Admin Desa"}
                    </span>
                  </div>
                  {creator?.phone && (
                    <div className="flex items-center">
                      <i className="fas fa-phone mr-3 text-blue-600"></i>
                      <span className="text-gray-700">{creator.phone}</span>
                    </div>
                  )}
                  {creator?.email && (
                    <div className="flex items-center">
                      <i className="fas fa-envelope mr-3 text-blue-600"></i>
                      <span className="text-gray-700">{creator.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button 
                  size="lg" 
                  onClick={handleWhatsAppContact}
                  disabled={!creator?.phone}
                  className="!rounded-button whitespace-nowrap w-full bg-green-600 hover:bg-green-700"
                >
                  <i className="fab fa-whatsapp mr-2"></i>
                  Hubungi via WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InformasiKontak;