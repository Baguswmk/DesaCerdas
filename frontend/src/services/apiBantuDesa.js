import axiosInstance from "./api";


export const getKegiatanAktif = (params = {}) => {
  const { status = "AKTIF", page = 1, limit = 10, search = "" } = params;
  return axiosInstance.get("/bantu-desa/kegiatan-desa", { 
    params: { status, page, limit, search }
  });
};

export const getDetailKegiatan = (id) =>
  axiosInstance.get(`/bantu-desa/kegiatan-desa/${id}`);

export const createKegiatan = (data) =>
  axiosInstance.post("/bantu-desa/kegiatan-desa", data);

export const updateKegiatan = (id, data) =>
  axiosInstance.put(`/bantu-desa/kegiatan-desa/${id}`, data);

export const deleteKegiatan = (id) =>
  axiosInstance.delete(`/bantu-desa/kegiatan-desa/${id}`);


export const createDonasi = (kegiatanId, data) =>
  axiosInstance.post(`/bantu-desa/kegiatan-desa/${kegiatanId}/donasi`, data);

export const getDonasiPending = () =>
  axiosInstance.get("/bantu-desa/donasi/pending");

export const verifyDonasi = (donasiId, data) =>
  axiosInstance.put(`/bantu-desa/donasi/${donasiId}/verify`, data);

export const getDonasiHistory = () =>
  axiosInstance.get("/bantu-desa/donasi/history");


export const uploadSingleImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return axiosInstance.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const uploadBuktiTransfer = (file) => {
  const formData = new FormData();
  formData.append("bukti", file);
  return axiosInstance.post("/upload/bukti-transfer", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};
