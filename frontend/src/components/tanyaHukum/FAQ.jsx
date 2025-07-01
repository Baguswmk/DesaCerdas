import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"
import useThemeStore  from '@/store/theme';

const FAQ = () => {
  const { isDarkMode } = useThemeStore();

    return (
        <div className={`mt-8 ${isDarkMode ? 'bg-[#232D42] bg-opacity-70' : 'bg-gray-50'} rounded-lg p-6 shadow-lg`}>
            <h2 className="text-xl font-semibold mb-4">Referensi & FAQ Hukum</h2>
            <Tabs defaultValue="faq">
                <TabsList className="mb-4">
                    <TabsTrigger value="faq" className="!rounded-button whitespace-nowrap cursor-pointer">FAQ</TabsTrigger>
                    <TabsTrigger value="references" className="!rounded-button whitespace-nowrap cursor-pointer">Referensi UU</TabsTrigger>
                </TabsList>
                <TabsContent value="faq">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                q: "Apa perbedaan antara PT dan CV?",
                                a: "PT (Perseroan Terbatas) adalah badan hukum yang kepemilikannya terbagi atas saham, sedangkan CV (Commanditaire Vennootschap) adalah persekutuan yang terdiri dari satu atau lebih sekutu komanditer."
                            },
                            {
                                q: "Bagaimana cara mendaftarkan hak cipta?",
                                a: "Pendaftaran hak cipta dapat dilakukan melalui DJKI (Direktorat Jenderal Kekayaan Intelektual) dengan mengisi formulir, membayar biaya, dan melampirkan dokumen yang diperlukan."
                            },
                            {
                                q: "Berapa lama proses pengurusan IMB?",
                                a: "Proses pengurusan IMB umumnya memakan waktu 14-30 hari kerja, tergantung pada kompleksitas bangunan dan kelengkapan dokumen yang diajukan."
                            }
                        ].map((item, index) => (
                            <Card key={index} className={`p-4 ${isDarkMode ? 'bg-[#1A2332]' : 'bg-white'}`}>
                                <h3 className="font-medium mb-2">{item.q}</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.a}</p>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="references">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                title: "UU No. 40 Tahun 2007",
                                desc: "Tentang Perseroan Terbatas",
                                link: "#"
                            },
                            {
                                title: "UU No. 28 Tahun 2014",
                                desc: "Tentang Hak Cipta",
                                link: "#"
                            },
                            {
                                title: "UU No. 11 Tahun 2020",
                                desc: "Tentang Cipta Kerja",
                                link: "#"
                            }
                        ].map((item, index) => (
                            <Card key={index} className={`p-4 ${isDarkMode ? 'bg-[#1A2332]' : 'bg-white'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{item.title}</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.desc}</p>
                                    </div>
                                    <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                                        <i className="fas fa-external-link-alt"></i>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FAQ;
