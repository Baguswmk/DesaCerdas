import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LOCATION_LABELS } from "@/data/locationLabels";
import useFarmSmartStore from "@/store/farmStore";

const LocationSelect = () => {
  const { location, setLocation } = useFarmSmartStore();
  return (
    <div className="w-full">
      <label className="block mb-2 font-medium text-sm">Pilih Lokasi</label>
      <Select value={location} onValueChange={(val) => setLocation(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih Desa/Kelurahan" />
        </SelectTrigger>
        <SelectContent className="max-h-72 overflow-y-auto">
          {Object.entries(LOCATION_LABELS).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelect;
