import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const DetailInformasi = ({ deskripsi = "", jadwal = [], persyaratan = {}, galeri = [] }) => {
    const [activeTab, setActiveTab] = useState("deskripsi");

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="deskripsi">Deskripsi</TabsTrigger>
                        <TabsTrigger value="jadwal">Jadwal Acara</TabsTrigger>
                        <TabsTrigger value="persyaratan">Persyaratan</TabsTrigger>
                        <TabsTrigger value="galeri">Galeri</TabsTrigger>
                    </TabsList>

                    {/* Deskripsi */}
                    <TabsContent value="deskripsi">
                        <Card>
                            <CardContent className="p-8 prose prose-lg text-gray-700">
                                <h3 className="text-2xl font-bold mb-4">Tentang Kegiatan</h3>
                                <div dangerouslySetInnerHTML={{ __html: deskripsi }} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Jadwal */}
                    <TabsContent value="jadwal" className="space-y-6">
                        <Card>
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Jadwal Acara</h3>
                                <div className="space-y-6">
                                    {(jadwal ?? []).map((item, index) => (

                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">{item.jam}</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{item.judul}</h4>
                                                <p className="text-gray-600">{item.deskripsi}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Persyaratan */}
                    <TabsContent value="persyaratan" className="space-y-6">
                        <Card>
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Persyaratan Partisipasi</h3>
                                <div className="space-y-6">
                                    {["umum", "lomba", "dibawa"].map((kategori, i) => (
                                        <div key={i}>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                                {kategori === "umum"
                                                    ? "Persyaratan Umum"
                                                    : kategori === "lomba"
                                                        ? "Persyaratan Lomba"
                                                        : "Yang Perlu Dibawa"}
                                            </h4>
                                            <ul className="space-y-2 text-gray-700">
                                                {(persyaratan?.[kategori] ?? []).map((item, j) => (
                                                    <li key={j} className="flex items-start">
                                                        <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}

                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Galeri */}
                    <TabsContent value="galeri" className="space-y-6">
                        <Card>
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Galeri Foto Kegiatan Sebelumnya</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(galeri ?? []).map((image, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                                            <img
                                                src={image}
                                                alt={`Galeri ${index + 1}`}
                                                className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </section>
    );
};

export default DetailInformasi;
