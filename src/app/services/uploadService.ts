import api from '../lib/api';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<{ url: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!data?.url) throw new Error('Upload did not return a URL');
  return data.url;
}
