import { axiosForBackend, logger } from './index';
import type {
  BearingInquiry,
  CreateInquiryDto,
  InquiryListResponse,
} from '@shared/api.interface';

export async function createInquiry(dto: CreateInquiryDto): Promise<BearingInquiry> {
  try {
    const response = await axiosForBackend.post('/inquiries', dto);
    return response.data;
  } catch (error) {
    logger.error('提交询盘失败', error);
    throw error;
  }
}

export async function getInquiryList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
}): Promise<InquiryListResponse> {
  try {
    const response = await axiosForBackend.get('/inquiries', { params });
    return response.data;
  } catch (error) {
    logger.error('获取询盘列表失败', error);
    throw error;
  }
}

export async function getInquiryById(id: string): Promise<BearingInquiry> {
  try {
    const response = await axiosForBackend.get(`/inquiries/${id}`);
    return response.data;
  } catch (error) {
    logger.error(`获取询盘详情失败: ${id}`, error);
    throw error;
  }
}

export async function updateInquiry(
  id: string,
  dto: { status?: string; replyContent?: string },
): Promise<BearingInquiry> {
  try {
    const response = await axiosForBackend.patch(`/inquiries/${id}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新询盘失败: ${id}`, error);
    throw error;
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/inquiries/${id}`);
  } catch (error) {
    logger.error(`删除询盘失败: ${id}`, error);
    throw error;
  }
}

export async function exportInquiriesCsv(params: {
  status?: string;
  keyword?: string;
}): Promise<Blob> {
  try {
    const response = await axiosForBackend.get('/inquiries/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    logger.error('导出询盘CSV失败', error);
    throw error;
  }
}
