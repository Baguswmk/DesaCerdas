import axiosInstance from "./api";

// ====== KEGIATAN DESA ======
export const getKegiatanAktif = (params = {}) => {
  const { status = "AKTIF", page = 1, limit = 10, search = "" } = params;
  return axiosInstance.get("/bantu-desa/kegiatan", {
    params: { status, page, limit, search }
  });
};

export const getDetailKegiatan = (id) =>
  axiosInstance.get(`/bantu-desa/kegiatan/${id}`);

export const createKegiatan = (data) =>
  axiosInstance.post("/bantu-desa/kegiatan", data);

export const updateKegiatan = (id, data) =>
  axiosInstance.put(`/bantu-desa/kegiatan/${id}`, data);

export const deleteKegiatan = (id) =>
  axiosInstance.delete(`/bantu-desa/kegiatan/${id}`);

// ====== DONASI ======
export const createDonasi = (kegiatanId, data) =>
  axiosInstance.post(`/bantu-desa/kegiatan/${kegiatanId}/donasi`, data);

export const getDonasiPending = () =>
  axiosInstance.get("/bantu-desa/donasi/pending");

export const verifyDonasi = (donasiId, data) =>
  axiosInstance.put(`/bantu-desa/donasi/${donasiId}/verify`, data);

export const getDonasiHistory = () =>
  axiosInstance.get("/bantu-desa/donasi/history");

// ====== UPLOAD ======
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