import { Progress } from "../../ui/progress"
import { Card, CardContent } from "../../ui/card"
import { Button } from "../../ui/button"

function formatCurrency(amount) {
    return `Rp${amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })}`;
}
const DonasiProgress = ({ terkumpul, target, deadline }) => {
  const persen = Math.min((terkumpul / target) * 100, 100);
  const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Donasi</h3>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Terkumpul: {formatCurrency(terkumpul)}</span>
                  <span>Target: {formatCurrency(target)}</span>
                </div>
                <Progress value={persen} className="h-3 mb-4" />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <i className="fas fa-clock mr-1"></i>
                    Sisa waktu: {daysLeft > 0 ? `${daysLeft} hari` : "Sudah berakhir"}
                  </div>
                  <div className="text-sm text-gray-600">
                    <i className="fas fa-users mr-1"></i>
                    {/* placeholder, nanti ganti dengan jumlah donatur */}
                    0 donatur
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <a href="#donasi" data-readdy="true">
                  <Button
                    size="lg"
                    className="!rounded-button whitespace-nowrap w-full cursor-pointer"
                  >
                    <i className="fas fa-heart mr-2"></i>
                    Donasi Sekarang
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DonasiProgress;
