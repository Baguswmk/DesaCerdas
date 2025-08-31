import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
function formatCurrency(amount) {
    return `Rp${amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })}`;
}

const BantuDesaKegiatan = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("kegiatan_desa")
                .select("*")
                .eq("status", "aktif")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Gagal mengambil data:", error);
            } else {
                setActivities(data);
            }
            setLoading(false);
        };

        fetchActivities();
    }, []);

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kegiatan Aktif
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Bergabunglah dalam berbagai kegiatan desa yang sedang berlangsung dan butuh dukungan Anda
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-gray-500">
                        <Loader2 className="animate-spin h-6 w-6 mr-3 text-primary" />
                        <span className="text-base">Memuat data kegiatan...</span>
                    </div>
                ) : activities.length === 0 ? (
                    <p className="text-center text-gray-500">Belum ada kegiatan aktif.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activities.map((activity) => (
                            <Card key={activity.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={activity.foto_url}
                                        alt={activity.judul}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.judul}</h3>
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        {new Date(activity.tanggal_mulai).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                        {activity.deskripsi}
                                    </p>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Terkumpul: {formatCurrency(activity.dana_terkumpul)}</span>
                                            <span>Target: {formatCurrency(activity.target_dana)}</span>
                                        </div>
                                        <Progress
                                            value={(activity.dana_terkumpul / activity.target_dana) * 100}
                                            className="h-2"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button className="flex-1 !rounded-button whitespace-nowrap">
                                            <i className="fas fa-heart mr-2"></i>
                                            Donasi
                                        </Button>
                                        <Link to={`/bantu-desa/${activity.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full !rounded-button whitespace-nowrap">
                                                <i className="fas fa-info-circle mr-2"></i>
                                                Detail
                                            </Button>
                                        </Link>

                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BantuDesaKegiatan;
